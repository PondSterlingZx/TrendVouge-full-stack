import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Components
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Login from './components/Login'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'

// Constants
export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = '$'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/" replace />
  }
  return children
}

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const location = useLocation()

  // Handle token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  // Reset sidebar state on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }, [location])

  // Handle logout
  const handleLogout = () => {
    setToken('')
    localStorage.removeItem('token')
  }

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <div className="flex flex-col h-screen">
          <Navbar 
            onLogout={handleLogout} 
            toggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          />
          
          <div className='flex flex-1 w-full overflow-hidden'>
            <Sidebar 
              isOpen={isSidebarOpen} 
              onClose={() => setIsSidebarOpen(false)}
            />
            
            <main className={`
              flex-1 p-4 overflow-auto transition-all duration-300
              ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}
            `}>
              <div className='max-w-7xl mx-auto'>
                <Routes>
                  <Route path="/" element={<Navigate to="/list" replace />} />
                  
                  <Route path="/add" element={
                    <ProtectedRoute>
                      <Add token={token} />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/list" element={
                    <ProtectedRoute>
                      <List token={token} />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <Orders token={token} />
                    </ProtectedRoute>
                  } />

                  {/* 404 Page */}
                  <Route path="*" element={
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                      <h1 className="text-4xl font-bold text-gray-800">404</h1>
                      <p className="text-gray-600 mt-2">Page not found</p>
                    </div>
                  } />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  )
}

export default App