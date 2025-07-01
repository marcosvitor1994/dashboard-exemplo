import "./globals.css"

export const metadata = {
  title: "Brasilseg - Dashboard de Influenciadores",
  description: "Dashboard para visualização de campanhas de influenciadores da Brasilseg.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
