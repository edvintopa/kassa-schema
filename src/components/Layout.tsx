import { useLocation, Outlet } from 'react-router-dom'
import Header from './header/Header'
import '../App.css'

// Remove the LayoutProps interface - no longer needed
function Layout() {
  const location = useLocation()
  
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-grow flex justify-center w-full">
        <div 
          key={location.pathname} 
          className="w-full max-w-4xl pt-4 pb-0 animate-fadeIn"
        >
          <Outlet /> {/* Replace children with Outlet */}
        </div>
      </main>
    </div>
  )
}

export default Layout