export function TrinacriaMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="6.5" />
      <path d="M24 17.5V6M24 6c-3 0-3 3.4 0 5.6" />
      <path d="M29.6 27.25 39.2 33M39.2 33c1-2.7-1.9-4.2-3.7-2.5" />
      <path d="M18.4 27.25 8.8 33M8.8 33c-1-2.7 1.9-4.2 3.7-2.5" />
    </svg>
  )
}
