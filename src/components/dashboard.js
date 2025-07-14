"use client"

import { useState, useEffect, useMemo } from "react"
import UserMenu from "./UserMenu"
import { ResponsiveBar } from "@nivo/bar"
import { ResponsiveLine } from "@nivo/line"

// Mapeamento das imagens dos influenciadores
const influencerImages = {
  "Karen Jonz": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCrHFo3E9ApKjT9WxmQOW5hN47Hl2tmW_ZsA&s",
  "Beatriz Algranti":
    "https://media.licdn.com/dms/image/v2/C4E03AQFCYt-Me3feaQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1587398303076?e=1756944000&v=beta&t=47BkuUY5CSQZq30NaiSTB0aKjizRtvO2hfi591Glw60",
  "Camila Fremder": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjymsA5jWOuCPhEqfweDgfiQxRtJfOELmRtg&s",
  "Casa Loft 320":
    "https://static.wixstatic.com/media/701fc0_43f02d8c55054e7fa48b9f9f45fd0b88~mv2.jpg/v1/fill/w_640,h_480,fp_0.50_0.50,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/701fc0_43f02d8c55054e7fa48b9f9f45fd0b88~mv2.jpg",
  "Gaby Ferraz":
    "https://yt3.googleusercontent.com/Kr7h2kJMDvV7dvyQa6JFpiuwtoBXp3eRUHknTcR9uIeNFs-CAY8GVcU1GsVl_pMLcIWflAF18A=s900-c-k-c0x00ffffff-no-rj",
  "Lela Brandão": "https://thesummerhunter.com/content/images/2019/03/lela-brandao-feminismo-ilustracao-6.jpg",
  "Lorenzo Roos":
    "https://yt3.googleusercontent.com/dE0NoKpZmp0e3RQlRQTeAlB11AQkd7VBmHAsjMPjX-nxfM_WTqQjiJETcEM70kpB57dRm56eng=s900-c-k-c0x00ffffff-no-rj",
  "SP Lovers":
    "https://scontent-gru1-2.xx.fbcdn.net/v/t39.30808-6/291611365_459717506159026_696172992929225437_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=M_iD3T6MfdsQ7kNvwHkw_7E&_nc_oc=Adl2O91Ny7Ddm1J87-IZTafaxpmvVqEKACHEBvXWIWbfq2vo0Jybkrt1yJgm9qbigTc2eLtwXWgnX9Us0ih2ycid&_nc_zt=23&_nc_ht=scontent-gru1-2.xx&_nc_gid=jhWN6u9dvHKhkZNpCk8kKw&oh=00_AfSt092YpYOku4s976Zcd27vUJOPYCraf2LKA6xXYaxD-g&oe=687B2E22",
  "Drika Vida Na Roça": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS49KlhUMTskgeNQb2GZLFHCcVOIitQquRmyQ&s",
  "Lucas Cunha":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZmZOEqb-CusZ8FtGmdeOPv1DmQKtvwT9PfA&shttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZmZOEqb-CusZ8FtGmdeOPv1DmQKtvwT9PfA&s",
}

// --- Helper Functions ---
const safeParseInt = (val) => {
  const num = Number.parseInt(String(val).replace(/\D/g, ""), 10)
  return isNaN(num) ? 0 : num
}

const parseCurrency = (value) => {
  if (typeof value !== "string" || value.trim() === "") return 0
  const number = Number.parseFloat(
    value
      .replace(/R\$\s?/, "")
      .replace(/\./g, "")
      .replace(",", "."),
  )
  return isNaN(number) ? 0 : number
}

const formatCurrency = (value) => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

// --- Sub-components ---

const HeaderKpiCard = ({ value, label }) => (
  <div className="headerKpiCard">
    <p className="headerKpiValue">{value}</p>
    <p className="headerKpiLabel">{label}</p>
  </div>
)

const KpiCard = ({ value, label }) => (
  <div className="kpiCard">
    <p className="kpiValue">{value}</p>
    <p className="kpiLabel">{label}</p>
  </div>
)

const PostEmbed = ({ url }) => {
  useEffect(() => {
    const loadScript = (src, id, callback) => {
      if (document.getElementById(id)) {
        if (callback) callback()
        return
      }
      const script = document.createElement("script")
      script.id = id
      script.src = src
      script.async = true
      script.onload = callback
      document.body.appendChild(script)
    }

    if (url.includes("instagram.com")) {
      loadScript("https://www.instagram.com/embed.js", "instagram-embed-script", () => {
        if (window.instgrm) {
          window.instgrm.Embeds.process()
        }
      })
    } else if (url.includes("tiktok.com")) {
      loadScript("https://www.tiktok.com/embed.js", "tiktok-embed-script", () => {
        if (window.tiktok) {
          window.tiktok.load()
        }
      })
    }
  }, [url])

  const renderTikTokPlaceholder = () => (
    <div className="tiktokPlaceholder">
      <div className="tiktokIcon">♪</div>
      <p>Conteúdo do TikTok</p>
      <a href={url} target="_blank" rel="noopener noreferrer" className="postLink">
        Ver no TikTok
      </a>
    </div>
  )

  if (url.includes("tiktok.com")) {
    const videoIdMatch = url.match(/video\/(\d+)/)
    if (videoIdMatch && videoIdMatch[1]) {
      const videoId = videoIdMatch[1]
      return (
        <blockquote
          className="tiktok-embed"
          cite={url}
          data-video-id={videoId}
          style={{ maxWidth: "325px", minWidth: "325px", margin: "0 auto", height: "570px" }}
        >
          <section></section>
        </blockquote>
      )
    }
    return renderTikTokPlaceholder()
  }

  if (url.includes("instagram.com")) {
    return (
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
          background: "#FFF",
          border: "0",
          borderRadius: "3px",
          boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
          margin: "1px auto",
          maxWidth: "350px",
          width: "calc(100% - 2px)",
          padding: "0",
        }}
      ></blockquote>
    )
  }

  if (url.includes("youtube.com")) {
    const videoId = new URL(url).searchParams.get("v")
    if (videoId) {
      return (
        <iframe
          width="100%"
          height="200"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ borderRadius: "8px" }}
        ></iframe>
      )
    }
  }

  return (
    <div className="tiktokPlaceholder">
      <p>Conteúdo não disponível</p>
      <a href={url} target="_blank" rel="noopener noreferrer" className="postLink">
        Ver publicação original
      </a>
    </div>
  )
}

const CampaignCard = ({ campaign, onClick, isSelected }) => (
  <div className={`campaignCard ${isSelected ? "selected" : ""}`} onClick={() => onClick(campaign.name)}>
    <h3 className="campaignTitle">{campaign.name}</h3>
    <div className="campaignStats">
      <p>
        <strong>{campaign.postCount}</strong> posts
      </p>
      <p>
        <strong>{campaign.influencerCount}</strong> influenciadores
      </p>
    </div>
  </div>
)

const InfluencerCard = ({ influencer, onClick, isSelected }) => {
  const influencerImage =
    influencerImages[influencer.name] || `/placeholder.svg?width=80&height=80&text=${influencer.name.charAt(0)}`
  const [imageError, setImageError] = useState(false)
  const handleImageError = () => setImageError(true)

  return (
    <div className={`influencerCard ${isSelected ? "selected" : ""}`} onClick={() => onClick(influencer.name)}>
      <img
        src={imageError ? `/placeholder.svg?width=80&height=80&text=${influencer.name.charAt(0)}` : influencerImage}
        alt={influencer.name}
        className="avatar"
        onError={handleImageError}
        crossOrigin="anonymous"
      />
      <div className="influencerInfo">
        <h3 className="influencerName">{influencer.name}</h3>
        <div className="influencerStats">
          <span>{influencer.campaignCount} campanhas</span>
          <span>{influencer.postCount} posts</span>
        </div>
      </div>
    </div>
  )
}

const SentimentChart = ({ data }) => {
  const chartData = [
    { sentiment: "Positivo", value: data.positivo, color: "#22c55e" },
    { sentiment: "Neutro", value: data.neutro, color: "#a1a1aa" },
    { sentiment: "Negativo", value: data.negativo, color: "#ef4444" },
  ].filter((d) => d.value > 0)

  if (chartData.length === 0) return null

  return (
    <div className="sentimentChartWrapper">
      <ResponsiveBar
        data={chartData}
        keys={["value"]}
        indexBy="sentiment"
        margin={{ top: 10, right: 10, bottom: 40, left: 60 }}
        padding={0.4}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={({ data }) => data.color}
        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Sentimento",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Comentários",
          legendPosition: "middle",
          legendOffset: -50,
        }}
        enableLabel={true}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: "color", modifiers: [["darker", 2]] }}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        theme={{
          axis: {
            ticks: { text: { fontSize: 11 } },
            legend: { text: { fontSize: 12, fill: "#333" } },
          },
          tooltip: {
            container: {
              background: "#fff",
              color: "#333",
              fontSize: "12px",
              borderRadius: "2px",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.25)",
              padding: "5px 9px",
            },
          },
        }}
      />
    </div>
  )
}

const PostCard = ({ post }) => {
  const hasMetrics = post.Impressões || post.Alcance || post.Engajamento || post.Likes || post.Comentários
  const sentimentData = {
    positivo: post.Positivo,
    neutro: post.Neutro,
    negativo: post.Negativo,
  }
  const hasSentiment = sentimentData.positivo > 0 || sentimentData.neutro > 0 || sentimentData.negativo > 0

  return (
    <div className="postCard">
      <div>
        <div className="postInfo">
          <h4>{post.Campanha}</h4>
          <p>
            <strong>Plataforma:</strong> {post.Plataforma} | <strong>Formato:</strong> {post.Formato}
          </p>
          {post["Link da Publicação"] && (
            <a href={post["Link da Publicação"]} target="_blank" rel="noopener noreferrer" className="postLink">
              Ver Publicação Original
            </a>
          )}
        </div>
        {hasMetrics && (
          <div className="metricsGrid">
            <Metric label="Impressões" value={post.Impressões} />
            <Metric label="Alcance" value={post.Alcance} />
            <Metric label="Engajamento" value={post.Engajamento} />
            <Metric label="Likes" value={post.Likes} />
            <Metric label="Comentários" value={post.Comentários} />
            <Metric label="Compart." value={post.Compartilhamentos} />
            <Metric label="Salvos" value={post.Salvos} />
          </div>
        )}
        {hasSentiment && <SentimentChart data={sentimentData} />}
      </div>
      <div className="postEmbed">
        {post["Link da Publicação"] ? (
          <PostEmbed url={post["Link da Publicação"]} />
        ) : (
          <div className="tiktokPlaceholder">
            <p>Link da publicação não disponível</p>
          </div>
        )}
      </div>
    </div>
  )
}

const Metric = ({ label, value }) => {
  if (!value || value === "Mídia") return null
  return (
    <div className="metric">
      <span className="metricValue">{Number(value).toLocaleString("pt-BR")}</span>
      <span className="metricLabel">{label}</span>
    </div>
  )
}

const InfluencerDetail = ({ influencerName, posts, onClose }) => {
  const influencerKpis = useMemo(() => {
    return posts.reduce(
      (acc, post) => {
        acc.impressions += post["Impressões"]
        acc.engagement += post["Engajamento"]
        acc.views += post["Reproduções"] || post["Views"]
        acc.clicks += post["Cliques no Link"]
        // O investimento é único por influencer, então só atribuímos uma vez
        if (post.Investimento > 0) {
          acc.investment = post.Investimento
        }
        acc.mediaInvestment += post["Investimento Mídia"]
        return acc
      },
      { impressions: 0, engagement: 0, views: 0, clicks: 0, investment: 0, mediaInvestment: 0 },
    )
  }, [posts])

  const influencerImage =
    influencerImages[influencerName] || `/placeholder.svg?width=120&height=120&text=${influencerName.charAt(0)}`
  const [imageError, setImageError] = useState(false)
  const handleImageError = () => setImageError(true)

  return (
    <div className="overlay">
      <div className="modal">
        <div className="modalHeader">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <img
              src={
                imageError ? `/placeholder.svg?width=60&height=60&text=${influencerName.charAt(0)}` : influencerImage
              }
              alt={influencerName}
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid var(--brasilseg-yellow)",
              }}
              onError={handleImageError}
              crossOrigin="anonymous"
            />
            <h2>{influencerName}</h2>
          </div>
          <button onClick={onClose} className="closeButton">
            &times;
          </button>
        </div>
        <div className="modalContent">
          <div className="kpiGrid">
            <KpiCard value={formatCurrency(influencerKpis.investment)} label="Investimento" />
            <KpiCard value={formatCurrency(influencerKpis.mediaInvestment)} label="Invest. Mídia" />
            <KpiCard value={influencerKpis.impressions.toLocaleString("pt-BR")} label="Total Impressões" />
            <KpiCard value={influencerKpis.engagement.toLocaleString("pt-BR")} label="Total Engajamento" />
            <KpiCard value={influencerKpis.views.toLocaleString("pt-BR")} label="Total Views" />
            <KpiCard value={influencerKpis.clicks.toLocaleString("pt-BR")} label="Total Cliques" />
          </div>
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

// Custom layer para adicionar avatares acima das barras - VERSÃO FINAL CORRIGIDA
const BarAvatarLayer = ({ bars }) => {
  return (
    <g>
      <defs>
        {bars.map((bar, index) => (
          <clipPath key={`clip-bar-${index}`} id={`clip-bar-${index}`}>
            <circle cx={bar.x + bar.width / 2} cy={bar.y - 25} r="18" />
          </clipPath>
        ))}
      </defs>
      {bars.map((bar, index) => {
        const influencerName = bar.data.data.influencer
        const imageUrl =
          influencerImages[influencerName] || `/placeholder.svg?width=36&height=36&text=${influencerName.charAt(0)}`

        return (
          <g key={`avatar-bar-${index}`}>
            {/* Círculo de fundo branco */}
            <circle cx={bar.x + bar.width / 2} cy={bar.y - 25} r="18" fill="white" stroke="#e2e8f0" strokeWidth="2" />
            {/* Imagem do avatar */}
            <image
              href={imageUrl}
              x={bar.x + bar.width / 2 - 18}
              y={bar.y - 43}
              width={36}
              height={36}
              clipPath={`url(#clip-bar-${index})`}
              crossOrigin="anonymous"
              preserveAspectRatio="xMidYMid slice"
            />
          </g>
        )
      })}
    </g>
  )
}

// Custom layer para adicionar avatares acima dos pontos da linha - VERSÃO FINAL CORRIGIDA
const LineAvatarLayer = ({ points }) => {
  return (
    <g>
      <defs>
        {points.map((point, index) => (
          <clipPath key={`clip-line-${index}`} id={`clip-line-${index}`}>
            <circle cx={point.x} cy={point.y - 22} r="16" />
          </clipPath>
        ))}
      </defs>
      {points.map((point, index) => {
        const influencerName = point.data.x
        const imageUrl =
          influencerImages[influencerName] || `/placeholder.svg?width=32&height=32&text=${influencerName.charAt(0)}`

        return (
          <g key={`avatar-line-${index}`}>
            {/* Círculo de fundo branco */}
            <circle cx={point.x} cy={point.y - 22} r="16" fill="white" stroke="#e2e8f0" strokeWidth="2" />
            {/* Imagem do avatar */}
            <image
              href={imageUrl}
              x={point.x - 16}
              y={point.y - 38}
              width={32}
              height={32}
              clipPath={`url(#clip-line-${index})`}
              crossOrigin="anonymous"
              preserveAspectRatio="xMidYMid slice"
            />
          </g>
        )
      })}
    </g>
  )
}

const CampaignCharts = ({ posts, campaignName }) => {
  const chartData = useMemo(() => {
    const influencerData = new Map()

    posts.forEach((post) => {
      if (!influencerData.has(post.Influencer)) {
        influencerData.set(post.Influencer, {
          investment: 0,
          impressions: 0,
        })
      }
      const data = influencerData.get(post.Influencer)
      data.impressions += post["Impressões"]
      // O investimento é único por influencer, então só atribuímos uma vez
      if (post.Investimento > 0) {
        data.investment = post.Investimento
      }
    })

    const barData = Array.from(influencerData.entries()).map(([influencer, data]) => ({
      influencer,
      Investimento: data.investment,
    }))

    const lineData = [
      {
        id: "Impressões",
        data: Array.from(influencerData.entries()).map(([influencer, data]) => ({
          x: influencer,
          y: data.impressions,
        })),
      },
    ]

    return { barData, lineData }
  }, [posts])

  return (
    <div className="chartsGrid">
      <div className="chartWrapper">
        <h3 className="chartTitle">Investimento por Influenciador</h3>
        <ResponsiveBar
          data={chartData.barData}
          keys={["Investimento"]}
          indexBy="influencer"
          margin={{ top: 70, right: 30, bottom: 100, left: 90 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={{ scheme: "nivo" }}
          axisTop={null}
          axisRight={null}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Investimento (R$)",
            legendPosition: "middle",
            legendOffset: -70,
            format: (v) => `${(v / 1000).toLocaleString("pt-BR")}k`,
          }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 10,
            tickRotation: -35,
            legend: "Influenciadores",
            legendPosition: "middle",
            legendOffset: 80,
          }}
          enableLabel={false}
          animate={true}
          layers={["grid", "axes", "bars", "markers", "legends", BarAvatarLayer]}
          tooltip={({ id, value, indexValue }) => (
            <div
              style={{
                padding: "8px 12px",
                background: "white",
                border: "1px solid #ccc",
                borderRadius: "6px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            >
              <strong>{indexValue}</strong>
              <br />
              {id}: {formatCurrency(value)}
            </div>
          )}
        />
      </div>
      <div className="chartWrapper">
        <h3 className="chartTitle">Impressões por Influenciador</h3>
        <ResponsiveLine
          data={chartData.lineData}
          margin={{ top: 70, right: 30, bottom: 100, left: 90 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: "auto", max: "auto", stacked: false, reverse: false }}
          yFormat=" >-.2f"
          axisTop={null}
          axisRight={null}
          axisLeft={{
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Impressões",
            legendOffset: -70,
            legendPosition: "middle",
            format: (v) => `${(v / 1000000).toFixed(2)}M`,
          }}
          axisBottom={{
            orient: "bottom",
            tickSize: 5,
            tickPadding: 10,
            tickRotation: -35,
            legend: "Influenciadores",
            legendPosition: "middle",
            legendOffset: 80,
          }}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={3}
          pointBorderColor={{ from: "serieColor" }}
          useMesh={true}
          layers={[
            "grid",
            "markers",
            "axes",
            "areas",
            "crosshair",
            "lines",
            "points",
            "slices",
            "mesh",
            "legends",
            LineAvatarLayer,
          ]}
          tooltip={({ point }) => (
            <div
              style={{
                padding: "8px 12px",
                background: "white",
                border: "1px solid #ccc",
                borderRadius: "6px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            >
              <strong>{point.data.x}</strong>
              <br />
              Impressões: {point.data.yFormatted}
            </div>
          )}
        />
      </div>
    </div>
  )
}

// --- Main Dashboard Component ---

const Dashboard = () => {
  const [data, setData] = useState({ campaigns: [], influencers: [], posts: [] })
  const [loading, setLoading] = useState(true)
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [selectedInfluencer, setSelectedInfluencer] = useState(null)
  const [chartsVisible, setChartsVisible] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api-nacional.vercel.app/brasilseg/influencers")
        const result = await response.json()

        if (result.success && result.data && result.data.values) {
          const processedData = processData(result.data.values)
          setData(processedData)
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const processData = (values) => {
    if (!values || values.length < 2) {
      return { campaigns: [], influencers: [], posts: [] }
    }

    const headers = values[0]
    const rows = values.slice(1)

    const posts = rows
      .map((row, rowIndex) => {
        const post = {}
        headers.forEach((header, i) => {
          post[header] = row[i] || ""
        })
        post.id = `post-${rowIndex}`
        // Parse numeric values
        post["Impressões"] = safeParseInt(post["Impressões"])
        post["Alcance"] = safeParseInt(post["Alcance"])
        post["Engajamento"] = safeParseInt(post["Engajamento"])
        post["Cliques no Link"] = safeParseInt(post["Cliques no Link"])
        post["Reproduções"] = safeParseInt(post["Reproduções"])
        post["Views"] = safeParseInt(post["Views"])
        post["Likes"] = safeParseInt(post["Likes"])
        post["Comentários"] = safeParseInt(post["Comentários"])
        post["Compartilhamentos"] = safeParseInt(post["Compartilhamentos"])
        post["Salvos"] = safeParseInt(post["Salvos"])
        post["Positivo"] = safeParseInt(post["Positivo"])
        post["Neutro"] = safeParseInt(post["Neutro"])
        post["Negativo"] = safeParseInt(post["Negativo"])
        post["Investimento"] = parseCurrency(post["Investimento"])
        post["Investimento Mídia"] = parseCurrency(post["Investimento Mídia"])
        return post
      })
      .filter((post) => post.Influencer)

    const campaignsMap = new Map()
    const influencersMap = new Map()

    posts.forEach((post) => {
      if (post.Campanha) {
        if (!campaignsMap.has(post.Campanha)) {
          campaignsMap.set(post.Campanha, { name: post.Campanha, postCount: 0, influencerCount: new Set() })
        }
        const campaign = campaignsMap.get(post.Campanha)
        campaign.postCount += 1
        campaign.influencerCount.add(post.Influencer)
      }

      if (post.Influencer) {
        if (!influencersMap.has(post.Influencer)) {
          influencersMap.set(post.Influencer, { name: post.Influencer, postCount: 0, campaignCount: new Set() })
        }
        const influencer = influencersMap.get(post.Influencer)
        influencer.postCount += 1
        influencer.campaignCount.add(post.Campanha)
      }
    })

    const campaigns = Array.from(campaignsMap.values()).map((c) => ({ ...c, influencerCount: c.influencerCount.size }))
    const influencers = Array.from(influencersMap.values()).map((i) => ({ ...i, campaignCount: i.campaignCount.size }))

    return { campaigns, influencers, posts }
  }

  const handleCampaignClick = (campaignName) => {
    const newSelectedCampaign = selectedCampaign === campaignName ? null : campaignName
    setSelectedCampaign(newSelectedCampaign)
    setSelectedInfluencer(null)
    setChartsVisible(!!newSelectedCampaign)
  }

  const handleInfluencerClick = (influencerName) => {
    setSelectedInfluencer((prev) => (prev === influencerName ? null : influencerName))
    setSelectedCampaign(null)
    setChartsVisible(false)
  }

  const resetFilters = () => {
    setSelectedCampaign(null)
    setSelectedInfluencer(null)
    setChartsVisible(false)
  }

  const filteredPosts = useMemo(() => {
    if (selectedInfluencer) {
      return data.posts.filter((p) => p.Influencer === selectedInfluencer)
    }
    if (selectedCampaign) {
      return data.posts.filter((p) => p.Campanha === selectedCampaign)
    }
    return data.posts
  }, [selectedCampaign, selectedInfluencer, data.posts])

  const filteredInfluencers = useMemo(() => {
    if (!selectedCampaign) return data.influencers
    const influencersInCampaign = new Set(filteredPosts.map((p) => p.Influencer))
    return data.influencers.filter((i) => influencersInCampaign.has(i.name))
  }, [selectedCampaign, data.influencers, filteredPosts])

  const filteredCampaigns = useMemo(() => {
    if (!selectedInfluencer) return data.campaigns
    const campaignsForInfluencer = new Set(filteredPosts.map((p) => p.Campanha))
    return data.campaigns.filter((c) => campaignsForInfluencer.has(c.name))
  }, [selectedInfluencer, data.campaigns, filteredPosts])

  const kpis = useMemo(() => {
    const relevantPosts = filteredPosts
    const totals = relevantPosts.reduce(
      (acc, post) => {
        acc.impressions += post["Impressões"]
        acc.engagement += post["Engajamento"]
        acc.views += post["Reproduções"] || post["Views"]
        acc.mediaInvestment += post["Investimento Mídia"]
        return acc
      },
      { impressions: 0, engagement: 0, views: 0, mediaInvestment: 0 },
    )

    const investmentByInfluencer = new Map()
    relevantPosts.forEach((post) => {
      if (post.Influencer && post.Investimento > 0) {
        investmentByInfluencer.set(post.Influencer, post.Investimento)
      }
    })
    const totalInvestment = Array.from(investmentByInfluencer.values()).reduce((sum, val) => sum + val, 0)

    return {
      ...totals,
      investment: totalInvestment,
      campaigns: new Set(relevantPosts.map((p) => p.Campanha)).size,
      influencers: new Set(relevantPosts.map((p) => p.Influencer)).size,
      posts: relevantPosts.length,
    }
  }, [filteredPosts])

  const hasActiveFilter = selectedCampaign || selectedInfluencer

  if (loading) {
    return (
      <div className="loading">
        Carregando dados...
        <div className="loadingSpinner"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="topBar">
        <div className="topBarLeft">
          <img src="/brasilseg-logo-png.webp" alt="Brasilseg" className="topBarBrasilsegLogo" />
          <span className="topBarSubtitle">Dashboard de Influenciadores</span>
        </div>
        <div className="topBarRight">
          <UserMenu />
          <img src="/Logo_Nacional_topo.webp" alt="Nacional Comunicação" className="nacionalLogo" />
        </div>
      </div>

      <header className="header">
        <div className="headerKpiGrid">
          <HeaderKpiCard value={formatCurrency(kpis.investment)} label="Investimento Total" />
          <HeaderKpiCard value={formatCurrency(kpis.mediaInvestment)} label="Investimento Mídia" />
          <HeaderKpiCard value={kpis.campaigns.toLocaleString("pt-BR")} label="Campanhas" />
          <HeaderKpiCard value={kpis.influencers.toLocaleString("pt-BR")} label="Influenciadores" />
          <HeaderKpiCard value={kpis.posts.toLocaleString("pt-BR")} label="Posts" />
          <HeaderKpiCard value={kpis.impressions.toLocaleString("pt-BR")} label="Impressões" />
          <HeaderKpiCard value={kpis.engagement.toLocaleString("pt-BR")} label="Engajamento" />
          <HeaderKpiCard value={kpis.views.toLocaleString("pt-BR")} label="Views" />
        </div>
      </header>

      <div className="sectionHeader">
        <h2 className="sectionTitle">Campanhas</h2>
        {hasActiveFilter && (
          <button onClick={resetFilters} className="resetButton">
            Limpar Filtros
          </button>
        )}
      </div>
      <div className="campaignsGrid">
        {filteredCampaigns.map((campaign) => (
          <CampaignCard
            key={campaign.name}
            campaign={campaign}
            onClick={handleCampaignClick}
            isSelected={selectedCampaign === campaign.name}
          />
        ))}
      </div>

      <div className={`chartsContainer ${chartsVisible ? "visible" : ""}`}>
        {selectedCampaign && <CampaignCharts posts={filteredPosts} campaignName={selectedCampaign} />}
      </div>

      <div className="sectionHeader">
        <h2 className="sectionTitle">Influenciadores</h2>
      </div>
      <div className="cardGrid">
        {filteredInfluencers.map((influencer) => (
          <InfluencerCard
            key={influencer.name}
            influencer={influencer}
            onClick={handleInfluencerClick}
            isSelected={selectedInfluencer === influencer.name}
          />
        ))}
      </div>

      {selectedInfluencer && (
        <InfluencerDetail
          influencerName={selectedInfluencer}
          posts={filteredPosts}
          onClose={() => setSelectedInfluencer(null)}
        />
      )}
    </div>
  )
}

export default Dashboard
