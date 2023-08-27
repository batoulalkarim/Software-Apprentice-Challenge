import React from "react";
import styles from "../styles/CardList.module.scss";
import { useEffect, useState } from "react";
import Card from "./Card";

const CardList = () => {
  const [ads, setAds] = useState([]);
  const [sortedAds, setSortedAds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [allStandardizedAds, setAllStandardizedAds] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/fakeDataSet")
      .then((res) => res.json())
      .then((data) => {
        setAds(data);
      });
  }, []);

  const standardizeAds = (adsArray, platform) => {
    return adsArray.map((ad) => ({
      campaign: ad.campaign_name || ad.campaign || ad.utm_campaign,
      adSet:
        ad.media_buy_name || ad.ad_group || ad.ad_squad_name || ad.utm_medium,
      creative:
        ad.ad_name || ad.image_name || ad.creative_name || ad.utm_content,
      spend: ad.spend || ad.cost || 0,
      impressions: ad.impressions || 0,
      clicks: ad.clicks || ad.post_clicks || 0,
      results: null,
      platform: platform,
    }));
  };

  const allocateResultsFromGoogleAnalytics = (adsArray) => {
    return adsArray.map((ad) => {
      const matchingGoogleAd = ads.google_analytics.find(
        (gaAd) => gaAd.utm_campaign === ad.campaign
      );
      if (matchingGoogleAd) {
        return { ...ad, results: matchingGoogleAd.results };
      }
      return ad;
    });
  };

  useEffect(() => {
    if (
      ads.facebook_ads &&
      ads.snapchat_ads &&
      ads.twitter_ads &&
      ads.google_analytics
    ) {
      const snapchatAds = standardizeAds(ads.snapchat_ads, "Snapchat");
      const facebookAds = standardizeAds(ads.facebook_ads, "Facebook");
      const twitterAds = standardizeAds(ads.twitter_ads, "Twitter");

      const allAds = [...facebookAds, ...snapchatAds, ...twitterAds];
      setAllStandardizedAds(allAds);

      const adsWithResults = allocateResultsFromGoogleAnalytics(allAds);
      setSortedAds(adsWithResults);
    }
  }, [ads]);

  const sortAds = (order) => {
    const sorted = [...sortedAds];
    sorted.sort((a, b) =>
      order === "asc" ? a.spend - b.spend : b.spend - a.spend
    );
    setSortedAds(sorted);
  };

  const clearSorting = () => {
    setSortedAds(allStandardizedAds);
  };

  const searchAds = () => {
    const searchTermLower = searchTerm.toLowerCase();
    const filteredAds = sortedAds.filter((ad) => {
      const campaignLower = ad.campaign.toLowerCase();
      return campaignLower.includes(searchTermLower);
    });
    setSortedAds(filteredAds);
  };

  //   console.log("facebook", ads.facebook_ads);
  return (
    <div className="app">
      <input
        type="text"
        placeholder="Search by campaign name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={searchAds}>Search</button>
      <button onClick={() => sortAds("asc")}>Sort by Spend (Asc)</button>
      <button onClick={() => sortAds("desc")}>Sort by Spend (Desc)</button>
      <button onClick={clearSorting}>Clear Sorting</button>
      {sortedAds.map((ad, index) => (
        <Card ad={ad} key={index} />
      ))}
    </div>
  );
};

export default CardList;
