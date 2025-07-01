"use client"
import styles from "./campaign-card.module.css"

export default function CampaignCard({ campaign, onClick, isSelected }) {
  return (
    <div className={`${styles.card} ${isSelected ? styles.selected : ""}`} onClick={() => onClick(campaign.name)}>
      <h3 className={styles.title}>{campaign.name}</h3>
      <div className={styles.stats}>
        <p>
          <strong>{campaign.postCount}</strong> posts
        </p>
        <p>
          <strong>{campaign.influencerCount}</strong> influenciadores
        </p>
      </div>
    </div>
  )
}
