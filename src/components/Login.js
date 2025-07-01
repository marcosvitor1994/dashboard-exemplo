"use client"
import { GoogleLogin } from "@react-oauth/google"
import { useAuth } from "../contexts/AuthContext"

const Login = () => {
  const { login } = useAuth()

  const handleSuccess = (credentialResponse) => {
    if (credentialResponse.credential) {
      login(credentialResponse.credential)
    }
  }

  const handleError = () => {
    console.error("Erro no login com Google")
  }

  return (
    <div className="loginContainer">
      {/* Background com overlay */}
      <div className="loginBackground">
        <div className="loginOverlay"></div>
      </div>

      {/* Conteúdo do Login */}
      <div className="loginContent">
        <div className="loginCard">
          {/* Header */}
          <div className="loginHeader">
            <div className="logoContainer">
              <img src="/brasilseg-logo-png.webp" alt="Brasilseg" className="loginLogo" />
            </div>
            <h1 className="loginTitle">Dashboard de Influenciadores</h1>
            <p className="loginSubtitle">Faça login para acessar o sistema</p>
          </div>

          {/* Google Login Button */}
          <div className="googleLoginContainer">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              theme="outline"
              size="large"
              text="signin_with"
              shape="rectangular"
              logo_alignment="left"
            />
          </div>

          {/* Footer */}
          <div className="loginFooter">
            <p className="loginFooterText">Apenas usuários autorizados podem acessar este sistema</p>
          </div>
        </div>
      </div>

      {/* Logo Nacional no canto superior direito */}
      <img src="/Logo_Nacional_topo.webp" alt="Nacional Comunicação" className="nacionalLogoLogin" />
    </div>
  )
}

export default Login
