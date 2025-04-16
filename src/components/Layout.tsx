import React from 'react'
import { useLocation } from 'react-router-dom'
import Header from './header/Header'
import '../App.css'

interface LayoutProps {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  const location = useLocation()
  
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-grow flex justify-center w-full">
        <div 
          key={location.pathname} 
          className="w-full max-w-4xl pt-4 pb-0 animate-fadeIn"
        >
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout