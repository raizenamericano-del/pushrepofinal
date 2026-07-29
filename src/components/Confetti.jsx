const COLORS = ["#6366f1", "#22d3ee", "#a78bfa", "#34d399", "#fbbf24", "#f472b6"];

export default function Confetti({ count = 60 }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="absolute top-0 animate-confetti"
          style={{
            left: `${(i * 137.5) % 100}%`,
            width: 6 + (i % 3) * 4,
            height: 10 + (i % 4) * 4,
            backgroundColor: COLORS[i % COLORS.length],
            borderRadius: i % 2 ? "9999px" : "2px",
            animationDelay: `${(i % 20) * 0.12}s`,
            animationDuration: `${2.4 + (i % 5) * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}
