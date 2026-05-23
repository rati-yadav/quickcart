import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import '../styles/authPages.css'

export function SignUpPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { t } = useLanguage()
  const [first_name, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError(t('auth.passwordMismatch'))
      return
    }
    setPending(true)
    try {
      const username = email.trim()
      await register({
        username,
        email: username,
        password,
        first_name: first_name.trim(),
      })
      navigate('/')
    } catch (err) {
      setError(err.data?.detail || err.message || 'Could not create account')
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

      <div className="signup-box">
        <h1>{t('auth.signUpTitle')}</h1>
        {error ? <p className="auth-error">{error}</p> : null}
        <form onSubmit={onSubmit}>
          <label htmlFor="name">{t('auth.yourName')}</label>
          <input
            id="name"
            type="text"
            placeholder={t('auth.namePlaceholder')}
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <label htmlFor="email">{t('auth.mobileEmail')}</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">{t('auth.password')}</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder={t('auth.passwordHint')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          <label htmlFor="confirm">{t('auth.reenterPassword')}</label>
          <input
            id="confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button type="submit" className="btn" disabled={pending}>
            {pending ? t('auth.creating') : t('auth.createAccountBtn')}
          </button>
        </form>

        <p className="terms">
          By creating an account, you agree to Amazone&apos;s <a href="#">Conditions of Use</a> and{' '}
          <a href="#">Privacy Notice</a>.
        </p>

        <hr />

        <p className="signin-link">
          {t('auth.alreadyAccount')} <Link to="/signin">{t('signIn')}</Link>
        </p>
      </div>
      <p className="auth-back">
        <Link to="/">{t('backShopping')}</Link>
      </p>
    </div>
  )
}
