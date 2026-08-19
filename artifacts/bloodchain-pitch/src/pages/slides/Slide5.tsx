export default function Slide5() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#1B3A5C', fontFamily: "'Inter', sans-serif", position: 'relative', color: '#FFFFFF' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '2vw 2vh', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '10vw 10vh', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '3vh', left: '3vw', right: '3vw', bottom: '3vh', border: '1px solid rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '5vh', left: '5vw', right: '5vw', bottom: '5vh', border: '0.5px solid rgba(255,255,255,0.1)', pointerEvents: 'none' }} />

      <div style={{ padding: '7vh 7vw', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', position: 'relative', boxSizing: 'border-box' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.7vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}>Section 5</div>
            <div style={{ fontSize: '1vw', fontWeight: 600, fontFamily: 'monospace' }}>LIVE METRICS</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
            <div style={{ width: '0.8vw', height: '0.8vw', borderRadius: '50%', background: '#E74C3C', boxShadow: '0 0 0.8vw #E74C3C' }} />
            <div style={{ fontSize: '1vw', fontFamily: 'monospace', color: '#E74C3C' }}>LIVE</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '1.5vh', marginBottom: '1.5vh' }}>
          <h2 style={{ fontSize: '3.2vw', fontWeight: 300, margin: 0, letterSpacing: '0.05em', marginBottom: '0.8vh' }}>LIVE SYSTEM METRICS</h2>
          <p style={{ fontSize: '1.5vw', opacity: 0.5, margin: 0, marginBottom: '3vh', fontFamily: 'monospace' }}>The system is operational today</p>

          {/* Top row of 3 metrics */}
          <div style={{ display: 'flex', gap: '2vw', marginBottom: '2vw' }}>
            <div style={{ flex: 1, border: '1px solid rgba(255,255,255,0.3)', padding: '2vh 1.5vw', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.5, marginBottom: '0.5vh' }}>Units Tracked</div>
              <div style={{ fontSize: '5vw', fontWeight: 300, margin: '0.5vh 0', fontFamily: 'monospace', lineHeight: 1 }}>798</div>
              <div style={{ fontSize: '1vw', opacity: 0.5, borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '0.8vh' }}>Across the national network</div>
            </div>
            <div style={{ flex: 1, border: '1px solid rgba(255,255,255,0.3)', padding: '2vh 1.5vw', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.5, marginBottom: '0.5vh' }}>Facilities Online</div>
              <div style={{ fontSize: '5vw', fontWeight: 300, margin: '0.5vh 0', fontFamily: 'monospace', lineHeight: 1 }}>7</div>
              <div style={{ fontSize: '1vw', opacity: 0.5, borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '0.8vh' }}>Gaborone, Francistown, Maun, Serowe</div>
            </div>
            <div style={{ flex: 1, border: '1px solid rgba(255,255,255,0.3)', padding: '2vh 1.5vw', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#E74C3C', marginBottom: '0.5vh' }}>Active Alerts</div>
              <div style={{ fontSize: '5vw', fontWeight: 300, margin: '0.5vh 0', fontFamily: 'monospace', color: '#E74C3C', lineHeight: 1 }}>30</div>
              <div style={{ fontSize: '1vw', opacity: 0.5, borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '0.8vh' }}>Shortage alerts monitored in real time</div>
            </div>
          </div>

          {/* Bottom row of 2 metrics */}
          <div style={{ display: 'flex', gap: '2vw' }}>
            <div style={{ flex: 1, border: '1px solid rgba(255,255,255,0.3)', padding: '2vh 1.5vw', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.5, marginBottom: '0.5vh' }}>Blood Types Monitored</div>
              <div style={{ fontSize: '5vw', fontWeight: 300, margin: '0.5vh 0', fontFamily: 'monospace', lineHeight: 1 }}>8</div>
              <div style={{ fontSize: '1vw', opacity: 0.5, borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '0.8vh' }}>O+, O-, A+, A-, B+, B-, AB+, AB-</div>
            </div>
            <div style={{ flex: 1, border: '1px solid rgba(255,255,255,0.3)', padding: '2vh 1.5vw', background: 'rgba(255,255,255,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.5, marginBottom: '1vh' }}>Platform Status</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1vw', marginBottom: '0.8vh' }}>
                <div style={{ width: '0.7vw', height: '0.7vw', borderRadius: '50%', background: '#4ADE80' }} />
                <div style={{ fontSize: '1.5vw', fontFamily: 'monospace' }}>Web Portal — LIVE</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1vw' }}>
                <div style={{ width: '0.7vw', height: '0.7vw', borderRadius: '50%', background: '#4ADE80' }} />
                <div style={{ fontSize: '1.5vw', fontFamily: 'monospace' }}>Android APK — AVAILABLE</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '0.5px solid rgba(255,255,255,0.2)', paddingTop: '1.5vh' }}>
          <div><div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Status</div><div style={{ fontSize: '0.9vw', fontFamily: 'monospace', color: '#4ADE80' }}>LIVE</div></div>
          <div><div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Revision</div><div style={{ fontSize: '0.9vw', fontFamily: 'monospace' }}>—</div></div>
          <div><div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Page</div><div style={{ fontSize: '0.9vw', fontFamily: 'monospace' }}>05</div></div>
        </div>
      </div>
    </div>
  );
}
