import styles from "./post-card.module.css"

const Metric = ({ label, value }) => {
  if (!value || value === "Mídia") return null
  return (
    <div className={styles.metric}>
      <span className={styles.metricValue}>{Number(value).toLocaleString("pt-BR")}</span>
      <span className={styles.metricLabel}>{label}</span>
    </div>
  )
}

export default function PostCard({ post }) {
  const hasMetrics = post.Impressões || post.Alcance || post.Engajamento || post.Likes || post.Comentários

  return (
    <div className={styles.card}>
      <div className={styles.postInfo}>
        <h4>{post.Campanha}</h4>
        <p>
          <strong>Plataforma:</strong> {post.Plataforma} | <strong>Formato:</strong> {post.Formato}
        </p>
        {post["Link da Publicação"] && (
          <a href={post["Link da Publicação"]} target="_blank" rel="noopener noreferrer" className={styles.postLink}>
            Ver Publicação
          </a>
        )}
      </div>
      {hasMetrics && (
        <div className={styles.metricsGrid}>
          <Metric label="Impressões" value={post.Impressões} />
          <Metric label="Alcance" value={post.Alcance} />
          <Metric label="Engajamento" value={post.Engajamento} />
          <Metric label="Likes" value={post.Likes} />
          <Metric label="Comentários" value={post.Comentários} />
          <Metric label="Compart." value={post.Compartilhamentos} />
          <Metric label="Salvos" value={post.Salvos} />
        </div>
      )}
    </div>
  )
}
