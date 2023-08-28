import React, { useMemo } from "react";
import styles from "../styles/CardList.module.scss";
import { useEffect, useState, useRef } from "react";
import Card from "./Card";

const CardList = () => {
  const [ads, setAds] = useState([]);
  const [sortedAds, setSortedAds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState(""); // Values can be asc, desc, none
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

  const filtered = useMemo(() => {
    return allStandardizedAds
      .filter((item) =>
        item.campaign.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sort === "asc") {
          return a.spend - b.spend;
        } else if (sort === "desc") {
          return b.spend - a.spend;
        } else {
          return 0;
        }
      });
  }, [searchTerm, allStandardizedAds, sort]);

  return (
    <div className="app">
      <input
        type="text"
        placeholder="Search by campaign name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={() => setSort("asc")}>Sort by Spend (Asc)</button>
      <button onClick={() => setSort("desc")}>Sort by Spend (Desc)</button>
      <button onClick={() => setSort("none")}>Clear Sorting</button>
      {/* {sortedAds.map((ad, index) => ( */}
      {filtered.map((ad, index) => (
        <Card ad={ad} key={index} />
      ))}
    </div>
  );
};

export default CardList;
