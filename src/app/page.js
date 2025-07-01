import Dashboard from "../src/components/dashboard"
import { processData } from "../lib/data-processor"
import styles from "./page.module.css"

async function getData() {
  try {
    const res = await fetch("https://api-nacional.vercel.app/brasilseg/influencers", { next: { revalidate: 3600 } })
    if (!res.ok) {
      throw new Error("Falha ao buscar dados da API")
    }
    const json = await res.json()
    return processData(json.data.values)
  } catch (error) {
    console.error(error)
    return { campaigns: [], influencers: [], posts: [] }
  }
}

export default async function HomePage() {
  const { campaigns, influencers, posts } = await getData()

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: "10px" }}
          >
            <path
              d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
              stroke="#004AAD"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M2 7L12 12" stroke="#004AAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 7L12 12" stroke="#004AAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 22V12" stroke="#004AAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 4.5L17 9.5" stroke="#FFC700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Brasilseg
        </h1>
        <p className={styles.subtitle}>Dashboard de Influenciadores</p>
      </header>
      <Dashboard initialData={{ campaigns, influencers, posts }} />
    </main>
  )
}
