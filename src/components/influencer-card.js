"use client"
import styles from "./influencer-card.module.css"

export default function InfluencerCard({ influencer, onClick, isSelected }) {
  const influencerImage = `/placeholder.svg?width=80&height=80&text=${influencer.name.charAt(0)}`

  return (
    <div className={`${styles.card} ${isSelected ? styles.selected : ""}`} onClick={() => onClick(influencer.name)}>
      <img src={influencerImage || "/placeholder.svg"} alt={influencer.name} className={styles.avatar} />
      <div className={styles.info}>
        <h3 className={styles.name}>{influencer.name}</h3>
        <div className={styles.stats}>
          <span>{influencer.campaignCount} campanhas</span>
          <span>{influencer.postCount} posts</span>
        </div>
      </div>
    </div>
  )
}
