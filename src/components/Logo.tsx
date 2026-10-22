export default function Logo({ className = "size-9" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className={className}>
      <path d="M25.6 19.6 L25.6 48" fill="none" stroke="var(--violeta)" strokeWidth="4.4" strokeLinecap="round" />
      <path
        d="M25.6 19.6 L38.3 19.6 A9.3 9.3 0 0 1 38.3 38.2 L25.6 38.2"
        fill="none"
        stroke="var(--violeta)"
        strokeWidth="4.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="25.6" cy="54.4" r="3.9" fill="var(--papel)" stroke="var(--violeta)" strokeWidth="2.9" />
      <path d="M25.6 15.7 A8.3 8.3 0 0 1 16.7 6.9 A8.3 8.3 0 0 1 25.6 15.7 Z" fill="var(--violeta)" />
      <path d="M25.6 15.7 A8.3 8.3 0 0 0 34.4 6.9 A8.3 8.3 0 0 0 25.6 15.7 Z" fill="var(--violeta)" opacity="0.55" />
    </svg>
  );
}