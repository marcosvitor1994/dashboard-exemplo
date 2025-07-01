import { GoogleOAuthProvider } from "@react-oauth/google"
import { AuthProvider } from "./contexts/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Dashboard from "../components/Dashboard"
import "./App.css"

// Substitua pela sua Google Client ID
const GOOGLE_CLIENT_ID = "671833846107-d3b90bnlm7bn7aril9klj0oaooe0m0cs.apps.googleusercontent.com"

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <div className="App">
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </div>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App
