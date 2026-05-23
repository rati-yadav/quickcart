import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { HERO_SLIDES } from '../data/homeContent'

export function HeroCarousel() {
  const { messages } = useLanguage()
  const [current, setCurrent] = useState(0)
  const n = HERO_SLIDES.length
  const slides = messages.heroSlides

  const show = (index) => setCurrent(((index % n) + n) % n)

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % n)
    }, 5000)
    return () => clearInterval(id)
  }, [n])

  return (
    <div className="hero-section">
      <div className="hero-slides">
        {HERO_SLIDES.map((slide, index) => {
          const text = slides[index] || slides[0]
          return (
            <div key={index} className={`hero-slide ${index === current ? 'active' : ''}`}>
              <img
                className="hero-slide-img"
                src={slide.image}
                alt=""
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
              <div className="hero-content">
                <h2>{text.title}</h2>
                <p>{text.subtitle}</p>
                <Link to="/search?q=deal" className="hero-cta">
                  {text.cta}
                </Link>
              </div>
            </div>
          )
        })}
      </div>
      <div className="hero-controls">
        <button type="button" className="hero-prev" onClick={() => show(current - 1)} aria-label="Previous slide">
          <i className="fa-solid fa-chevron-left" />
        </button>
        <div className="hero-dots">
          {HERO_SLIDES.map((_, index) => (
            <span
              key={index}
              role="button"
              tabIndex={0}
              className={`dot ${index === current ? 'active' : ''}`}
              onClick={() => show(index)}
              onKeyDown={(e) => e.key === 'Enter' && show(index)}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
        <button type="button" className="hero-next" onClick={() => show(current + 1)} aria-label="Next slide">
          <i className="fa-solid fa-chevron-right" />
        </button>
      </div>
    </div>
  )
}
