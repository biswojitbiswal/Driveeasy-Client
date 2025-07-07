import React from 'react'
import { useSelector } from 'react-redux'
import UserNavbar from './Navbar/UserNavbar'
import AgentNavbar from './Navbar/AgentNavbar'
import AdminNavbar from './Navbar/AdminNavbar'
import Footer from './Footer'

function Layout({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const role = user?.role

  const renderNavbar = () => {
    if (!isAuthenticated || role === 'USER') {
      return <UserNavbar />
    }

    if (role === 'AGENT') {
      return <AgentNavbar />
    }

    if (role === 'ADMIN') {
      return <AdminNavbar />
    }

    // Default fallback
    return <UserNavbar />
  }

  return (
    <>
      {renderNavbar()}
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  )
}

export default Layout