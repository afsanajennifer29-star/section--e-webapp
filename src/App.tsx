export default function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        color: '#e5e7eb',
        padding: '24px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>
        Section E
      </h1>

      <Section title="Dramas" items={['K-Drama', 'C-Drama', 'J-Drama']} />
      <Section title="Movies" items={['Action', 'Romance', 'Thriller']} />
      <Section title="Studies" items={['Notes', 'Exams', 'Resources']} />

      {/* 🎬 VIDEO SECTION */}
      <h2 style={{ marginTop: '32px' }}>
        Featured Drama Episode
      </h2>

      <div
        style={{
          marginTop: '12px',
          position: 'relative',
          paddingTop: '56.25%', // 16:9
        }}
      >
        <iframe
          src="https://www.youtube.com/embed/U6dQei2YD6M"
          title="Ang Mutya Ng Section E Episode 1"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}

function Section({
  title,
  items,
}: {
  title: string
  items: string[]
}) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}


