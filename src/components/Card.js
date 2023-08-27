import React from "react";

const Card = ({ ad }) => {
  return (
    <div>
      <div>
        <p>{ad.campaign}</p>
        <p>{ad.adSet}</p>
        <p>{ad.creative}</p>
        <p>{ad.spend}</p>
        <p>{ad.impressions}</p>
        <p>{ad.clicks}</p>
        <p>{ad.results}</p>
      </div>
    </div>
  );
};

export default Card;
