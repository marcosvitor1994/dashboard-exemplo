"use client"
import PostCard from "./post-card"
import styles from "./influencer-detail.module.css"

export default function InfluencerDetail({ influencerName, posts, onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{influencerName}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            &times;
          </button>
        </div>
        <div className={styles.content}>
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <p>Nenhum post encontrado para este influenciador.</p>
          )}
        </div>
      </div>
    </div>
  )
}
