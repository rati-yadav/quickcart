import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { StarInput, StarRating } from './StarRating'

export function ProductReviews({ slug }) {
  const { isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [err, setErr] = useState('')
  const [pending, setPending] = useState(false)

  function load() {
    api(`/products/${slug}/reviews/`)
      .then(setReviews)
      .catch(() => setReviews([]))
  }

  useEffect(() => {
    load()
  }, [slug])

  async function submit(e) {
    e.preventDefault()
    if (!isAuthenticated) return
    setErr('')
    setPending(true)
    try {
      await api(`/products/${slug}/reviews/`, {
        method: 'POST',
        body: JSON.stringify({ rating, comment }),
      })
      setComment('')
      load()
    } catch (ex) {
      setErr(ex.data?.detail || ex.message)
    } finally {
      setPending(false)
    }
  }

  const avg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0

  return (
    <section className="product-reviews">
      <h2>
        {t('customerReviews')}{' '}
        {reviews.length > 0 && <StarRating value={avg} />} ({reviews.length})
      </h2>

      {isAuthenticated ? (
        <form className="review-form" onSubmit={submit}>
          <p>{t('writeReview')}</p>
          <StarInput value={rating} onChange={setRating} />
          <textarea
            rows={3}
            placeholder={t('reviewPlaceholder')}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {err ? <p className="review-error">{err}</p> : null}
          <button type="submit" className="hero-cta" disabled={pending}>
            {pending ? t('submitting') : t('submitReview')}
          </button>
        </form>
      ) : (
        <p className="review-signin-hint">{t('signInToReview')}</p>
      )}

      <ul className="review-list">
        {reviews.map((r) => (
          <li key={r.id}>
            <div className="review-head">
              <strong>{r.username}</strong>
              <StarRating value={r.rating} size="sm" />
            </div>
            {r.comment ? <p>{r.comment}</p> : null}
            <small>{new Date(r.created_at).toLocaleDateString()}</small>
          </li>
        ))}
      </ul>
    </section>
  )
}
