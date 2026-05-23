export function StarRating({ value = 0, max = 5, size = 'md' }) {
  const n = Math.round(Number(value) * 10) / 10
  return (
    <span className={`star-rating star-rating-${size}`} aria-label={`${n} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i + 1 <= Math.floor(n)
        const half = !filled && i < n
        return (
          <i
            key={i}
            className={
              filled
                ? 'fa-solid fa-star'
                : half
                  ? 'fa-solid fa-star-half-stroke'
                  : 'fa-regular fa-star'
            }
            aria-hidden
          />
        )
      })}
      <span className="star-rating-value">{n > 0 ? n.toFixed(1) : ''}</span>
    </span>
  )
}

export function StarInput({ value, onChange }) {
  return (
    <div className="star-input">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={n <= value ? 'active' : ''}
          onClick={() => onChange(n)}
          aria-label={`${n} stars`}
        >
          <i className={n <= value ? 'fa-solid fa-star' : 'fa-regular fa-star'} />
        </button>
      ))}
    </div>
  )
}
