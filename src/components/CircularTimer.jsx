// CircularTimer — SVG ring that animates countdown via stroke-dashoffset
// Color: IBM Blue (#0f62fe) during squeeze, IBM Green (#42be65) during release

const SIZE = 220
const STROKE = 10
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function CircularTimer({ timeLeft, totalSeconds, phase }) {
  const progress = totalSeconds > 0 ? timeLeft / totalSeconds : 0
  const dashOffset = CIRCUMFERENCE * (1 - progress)

  // Use Carbon token hex values for inline SVG — SCSS tokens not available here
  const color = phase === 'release' ? '#42be65' : '#0f62fe'

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '1.5rem 0' }}>
      <svg width={SIZE} height={SIZE} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background track */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="#393939"
          strokeWidth={STROKE}
        />
        {/* Progress ring */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          strokeLinecap="butt"
          style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }}
        />
        {/* Countdown number — rotate back to upright */}
        <text
          x={SIZE / 2}
          y={SIZE / 2}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            transform: `rotate(90deg) translate(0, 0)`,
            transformOrigin: `${SIZE / 2}px ${SIZE / 2}px`,
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '3.5rem',
            fontWeight: 600,
            fill: '#f4f4f4'
          }}
        >
          {timeLeft}
        </text>
      </svg>
    </div>
  )
}
