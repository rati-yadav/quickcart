/** Amazon-style: white wordmark + orange smile arrow (dark navbar) */
export function AmazonLogo({ className = '' }) {
  return (
    <svg
      className={`amazon-logo-svg ${className}`.trim()}
      viewBox="0 0 90 28"
      width="90"
      height="28"
      role="img"
      aria-label="Amazone"
    >
      <text
        x="0"
        y="19"
        fill="#ffffff"
        fontSize="20"
        fontWeight="700"
        fontFamily="Arial, Helvetica, sans-serif"
        letterSpacing="-0.5"
      >
        amazon
      </text>
      {/* Orange smile arrow (a → z) */}
      <path
        fill="#FF9900"
        d="M5.5 21.8c11.2 7.2 25.8 7.2 37 0 .35-.25.75-.15 1.05.2l1.2 1.3c.28.3.05.75-.38.8-12.8 7.2-29.5 7.2-42.3 0-.43-.05-.66-.5-.38-.8l1.2-1.3c.3-.35.7-.45 1.05-.2z"
      />
    </svg>
  )
}
