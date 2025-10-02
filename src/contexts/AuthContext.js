"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"

const AuthContext = createContext(undefined)

// Emails específicos autorizados
const AUTHORIZED_EMAILS = ["diogo.bobsin@gmail.com","lucas@goonadgroup.com", "marcosvitor1994@gmail.com"]

const AUTHORIZED_DOMAINS = [
  "goonadgroup.com",
  // Adicione aqui outros domínios corporativos que devem ter acesso
]

// Função para verificar se o email está autorizado
const isEmailAuthorized = (email) => {
  // Verifica se o email está na lista específica
  if (AUTHORIZED_EMAILS.includes(email)) {
    return true
  }

  // Verifica se o domínio do email está autorizado
  const domain = email.split("@")[1]
  return AUTHORIZED_DOMAINS.includes(domain)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se há um usuário salvo no localStorage
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Erro ao carregar usuário salvo:", error)
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = (credential) => {
    try {
      const decoded = jwtDecode(credential)

      console.log("Token decodificado:", decoded) // Para debug

      const userData = {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        sub: decoded.sub,
      }

      console.log("Dados do usuário:", userData) // Para debug

      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      localStorage.setItem("token", credential)
    } catch (error) {
      console.error("Erro ao decodificar token:", error)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  const isAuthenticated = !!user
  const isAuthorized = user ? isEmailAuthorized(user.email) : false

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAuthorized,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
