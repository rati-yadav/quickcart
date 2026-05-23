import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import '../styles/authPages.css'

export function SignInPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { t } = useLanguage()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setPending(true)
    try {
      await login(username.trim(), password)
      navigate('/')
    } catch (err) {
      setError(err.data?.detail || err.message || 'Sign in failed')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="amazon-logo">
        <Link to="/">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazone" />
        </Link>
      </div>

      <div className="signin-box">
        <h1>{t('auth.signInTitle')}</h1>
        {error ? <p className="auth-error">{error}</p> : null}
        <form onSubmit={onSubmit}>
          <label htmlFor="email">{t('auth.emailLabel')}</label>
          <input
            id="email"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="password">{t('auth.password')}</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="remember-me">
            <label>
              <input type="checkbox" /> {t('auth.keepSignedIn')}
            </label>
            <a href="#">{t('auth.forgotPassword')}</a>
          </div>

          <button type="submit" className="btn" disabled={pending}>
            {pending ? t('auth.signingIn') : t('auth.signInTitle')}
          </button>
        </form>

        <p className="terms">
          By continuing, you agree to Amazone&apos;s <a href="#">Conditions of Use</a> and{' '}
          <a href="#">Privacy Notice</a>.
        </p>

        <hr />

        <div className="new-to-amazon">
          <p>{t('auth.newToAmazon')}</p>
          <p>
            <Link to="/signup">{t('auth.createAccountBtn')}</Link>
          </p>
        </div>
      </div>
      <p className="auth-back">
        <Link to="/">{t('backShopping')}</Link>
      </p>
    </div>
  )
}
