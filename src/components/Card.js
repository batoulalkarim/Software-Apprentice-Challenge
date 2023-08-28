import React from "react";
import styles from "../styles/Card.module.scss";

const Card = ({ ad }) => {
  return (
    <div className={styles.container}>
      <p className={styles.text}>
        <strong>Campaign:</strong> {ad.campaign}
      </p>
      <p className={styles.text}>
        <strong>AdSet:</strong> {ad.adSet}
      </p>
      <p className={styles.text}>
        <strong>Creative:</strong> {ad.creative}
      </p>
      <p className={styles.text}>
        <strong>Spend:</strong> {ad.spend}
      </p>
      <p className={styles.text}>
        <strong>Impression:</strong> {ad.impressions}
      </p>
      <p className={styles.text}>
        <strong>Clicks:</strong> {ad.clicks}
      </p>
      <p className={styles.text}>
        <strong>Results:</strong> {ad.results}
      </p>
    </div>
  );
};

export default Card;
