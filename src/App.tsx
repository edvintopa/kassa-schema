import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home/Home'
import Live from './pages/Live/Live'
import Print from './pages/Print/Print'

function App() {
  return (
    <Router>
      <Routes>
        {/* Print route outside of Layout */}
        <Route path="/print" element={<Print />} />
        
        {/* Use the element prop for the layout and nested routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/live" element={<Live />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App