import { useState, useEffect } from 'react'
import './App.css'
import Home from './components/Home'
import Intro from './components/Intro'
import Photo from './components/Photo'
import Location from './components/Location'

function App() {
  const [showTopButton, setShowTopButton] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopButton(true)
      } else {
        setShowTopButton(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return (
    <main className="main">
      <Home />
      <Intro />
      <Photo />
      <Location />
      
      {/* 최상단 이동 버튼 */}
      <button 
        className={`scroll-to-top ${showTopButton ? 'show' : ''}`}
        onClick={scrollToTop}
        aria-label="맨 위로 이동"
      >
        ↑
      </button>
    </main>
  )
}

export default App
