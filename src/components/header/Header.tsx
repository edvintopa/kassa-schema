import React from 'react'
import { Link } from 'react-router-dom'

const Header: React.FC = () => {
  return (
    <header className="w-full bg-sky-600 shadow-neutral-900 py-4 px-6 transition-colors duration-200">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {/* Logo/Brand */}
          <Link to="/" className="text-xl font-bold text-neutral-50">
            KASSA SCHEMA
          </Link>
        </div>
        
        <div className="flex space-x-6 text-neutral-50">
            <p>© Edvin Topalovic 2025</p>
        </div>
      </div>
    </header>
  )
}

export default Header