import { useLanguage } from '../context/LanguageContext'

export function SiteFooter() {
  const { lang, setLang, t } = useLanguage()
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer>
      <div
        className="footer-backtotop"
        onClick={scrollTop}
        onKeyDown={(e) => e.key === 'Enter' && scrollTop()}
        role="button"
        tabIndex={0}
      >
        {t('footer.backToTop')}
      </div>
      <div className="footer-links">
        <div className="footer-col">
          <h3>{t('footer.getToKnow')}</h3>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
        </div>
        <div className="footer-col">
          <h3>{t('footer.connect')}</h3>
          <a href="#">Facebook</a>
          <a href="#">Instagram</a>
        </div>
        <div className="footer-col">
          <h3>{t('footer.makeMoney')}</h3>
          <a href="#">Sell on Amazone</a>
        </div>
        <div className="footer-col">
          <h3>{t('footer.letUsHelp')}</h3>
          <a href="#">{t('yourOrders')}</a>
          <a href="#">Help</a>
        </div>
      </div>
      <div className="footer-locale">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
          alt="Amazone"
          className="footer-logo"
        />
        <select
          className="footer-select"
          aria-label="Language"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
        </select>
        <select className="footer-select" aria-label="Currency">
          <option>INR - ₹</option>
          <option>USD - $</option>
        </select>
      </div>
      <div className="footer-bottom">
        <div className="footer-copyright">{t('footer.copyright')}</div>
      </div>
    </footer>
  )
}
