export default function Slide7() {
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
            <div style={{ fontSize: '0.7vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}>Section 7</div>
            <div style={{ fontSize: '1vw', fontWeight: 600, fontFamily: 'monospace' }}>DEPLOYMENT ROADMAP</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}>Ref No.</div>
            <div style={{ fontSize: '1vw', fontFamily: 'monospace' }}>DEP-07X</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '1.5vh', marginBottom: '1.5vh' }}>
          <h2 style={{ fontSize: '3.2vw', fontWeight: 300, margin: 0, letterSpacing: '0.05em', marginBottom: '3.5vh' }}>DEPLOYMENT ROADMAP</h2>

          <div style={{ display: 'flex', gap: '2.5vw' }}>
            {/* Phase I */}
            <div style={{ flex: 1, border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.03)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: '#E74C3C', padding: '1.2vh 1.5vw' }}>
                <div style={{ fontSize: '0.7vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.8 }}>Phase I</div>
                <div style={{ fontSize: '1.4vw', fontWeight: 600, fontFamily: 'monospace' }}>FOUNDATION</div>
              </div>
              <div style={{ padding: '1.5vh 1.5vw', flex: 1 }}>
                <div style={{ fontSize: '1.2vw', fontFamily: 'monospace', color: '#BAE6FD', marginBottom: '1.5vh' }}>Q3 2026</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
                  <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'flex-start' }}>
                    <div style={{ width: '0.3vw', height: '0.3vw', borderRadius: '50%', background: 'rgba(255,255,255,0.6)', marginTop: '0.8vh', flexShrink: 0 }} />
                    <p style={{ fontSize: '1.5vw', margin: 0, lineHeight: 1.4, opacity: 0.85 }}>NBTS Central Depository + 2 Gaborone hospitals live</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'flex-start' }}>
                    <div style={{ width: '0.3vw', height: '0.3vw', borderRadius: '50%', background: 'rgba(255,255,255,0.6)', marginTop: '0.8vh', flexShrink: 0 }} />
                    <p style={{ fontSize: '1.5vw', margin: 0, lineHeight: 1.4, opacity: 0.85 }}>All blood bank staff trained on Sanctum</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'flex-start' }}>
                    <div style={{ width: '0.3vw', height: '0.3vw', borderRadius: '50%', background: 'rgba(255,255,255,0.6)', marginTop: '0.8vh', flexShrink: 0 }} />
                    <p style={{ fontSize: '1.5vw', margin: 0, lineHeight: 1.4, opacity: 0.85 }}>Donor registration open to public via Pulse</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Phase II */}
            <div style={{ flex: 1, border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.03)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: 'rgba(231,76,60,0.6)', padding: '1.2vh 1.5vw' }}>
                <div style={{ fontSize: '0.7vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.8 }}>Phase II</div>
                <div style={{ fontSize: '1.4vw', fontWeight: 600, fontFamily: 'monospace' }}>NATIONAL ROLLOUT</div>
              </div>
              <div style={{ padding: '1.5vh 1.5vw', flex: 1 }}>
                <div style={{ fontSize: '1.2vw', fontFamily: 'monospace', color: '#BAE6FD', marginBottom: '1.5vh' }}>Q1 2027</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
                  <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'flex-start' }}>
                    <div style={{ width: '0.3vw', height: '0.3vw', borderRadius: '50%', background: 'rgba(255,255,255,0.6)', marginTop: '0.8vh', flexShrink: 0 }} />
                    <p style={{ fontSize: '1.5vw', margin: 0, lineHeight: 1.4, opacity: 0.85 }}>All 8 district hospitals connected</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'flex-start' }}>
                    <div style={{ width: '0.3vw', height: '0.3vw', borderRadius: '50%', background: 'rgba(255,255,255,0.6)', marginTop: '0.8vh', flexShrink: 0 }} />
                    <p style={{ fontSize: '1.5vw', margin: 0, lineHeight: 1.4, opacity: 0.85 }}>Vigil dashboard deployed to Ministry of Health</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'flex-start' }}>
                    <div style={{ width: '0.3vw', height: '0.3vw', borderRadius: '50%', background: 'rgba(255,255,255,0.6)', marginTop: '0.8vh', flexShrink: 0 }} />
                    <p style={{ fontSize: '1.5vw', margin: 0, lineHeight: 1.4, opacity: 0.85 }}>Real-time shortage alert system fully operational</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Phase III */}
            <div style={{ flex: 1, border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.03)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: 'rgba(231,76,60,0.3)', padding: '1.2vh 1.5vw' }}>
                <div style={{ fontSize: '0.7vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.8 }}>Phase III</div>
                <div style={{ fontSize: '1.4vw', fontWeight: 600, fontFamily: 'monospace' }}>REGIONAL EXPANSION</div>
              </div>
              <div style={{ padding: '1.5vh 1.5vw', flex: 1 }}>
                <div style={{ fontSize: '1.2vw', fontFamily: 'monospace', color: '#BAE6FD', marginBottom: '1.5vh' }}>Q4 2027</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
                  <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'flex-start' }}>
                    <div style={{ width: '0.3vw', height: '0.3vw', borderRadius: '50%', background: 'rgba(255,255,255,0.6)', marginTop: '0.8vh', flexShrink: 0 }} />
                    <p style={{ fontSize: '1.5vw', margin: 0, lineHeight: 1.4, opacity: 0.85 }}>Cross-border protocol with Zimbabwe, Zambia, South Africa</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'flex-start' }}>
                    <div style={{ width: '0.3vw', height: '0.3vw', borderRadius: '50%', background: 'rgba(255,255,255,0.6)', marginTop: '0.8vh', flexShrink: 0 }} />
                    <p style={{ fontSize: '1.5vw', margin: 0, lineHeight: 1.4, opacity: 0.85 }}>API open to accredited private hospitals and clinics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '0.5px solid rgba(255,255,255,0.2)', paddingTop: '1.5vh' }}>
          <div><div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Status</div><div style={{ fontSize: '0.9vw', fontFamily: 'monospace' }}>AUTHORIZED</div></div>
          <div><div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Revision</div><div style={{ fontSize: '0.9vw', fontFamily: 'monospace' }}>3.0</div></div>
          <div><div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Page</div><div style={{ fontSize: '0.9vw', fontFamily: 'monospace' }}>07</div></div>
        </div>
      </div>
    </div>
  );
}
