"use client"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"

const UserMenu = () => {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  return (
    <div className="userMenuContainer">
      <button className="userMenuButton" onClick={() => setIsOpen(!isOpen)}>
        <img src={user.picture || "/placeholder.svg"} alt={user.name} className="userAvatar" />
        <span className="userName">{user.name}</span>
        <span className="userMenuArrow">▼</span>
      </button>

      {isOpen && (
        <div className="userMenuDropdown">
          <div className="userInfo">
            <p className="userInfoName">{user.name}</p>
            <p className="userInfoEmail">{user.email}</p>
          </div>
          <hr className="userMenuDivider" />
          <button
            className="logoutButton"
            onClick={() => {
              logout()
              setIsOpen(false)
            }}
          >
            Sair
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu