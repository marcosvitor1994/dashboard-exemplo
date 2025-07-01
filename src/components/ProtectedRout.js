"use client"
import { useAuth } from "../contexts/AuthContext"
import Login from "./Login"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAuthorized, loading, user } = useAuth()

  if (loading) {
    return (
      <div className="loadingContainer">
        <div className="loadingSpinner"></div>
        <p>Carregando...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login />
  }

  if (!isAuthorized) {
    return (
      <div className="unauthorizedContainer">
        <div className="unauthorizedCard">
          <h2>Acesso Negado</h2>
          <p>Seu email ({user?.email}) não está autorizado a acessar este sistema.</p>
          <p>Entre em contato com o administrador para solicitar acesso.</p>
          <button onClick={() => window.location.reload()} className="retryButton">
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
