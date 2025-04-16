import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home/Home'
import About from './pages/About/About'  // Ensure your About component is in this location or adjust accordingly
import './App.css'

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  )
}

export default App