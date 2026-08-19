export default function Slide4() {
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
            <div style={{ fontSize: '0.7vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}>Section 4</div>
            <div style={{ fontSize: '1vw', fontWeight: 600, fontFamily: 'monospace' }}>SYSTEM ARCHITECTURE</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}>Ref No.</div>
            <div style={{ fontSize: '1vw', fontFamily: 'monospace' }}>SYS-04X</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '1.5vh', marginBottom: '1.5vh' }}>
          <h2 style={{ fontSize: '3.2vw', fontWeight: 300, margin: 0, letterSpacing: '0.05em', marginBottom: '1.5vh' }}>SYSTEM ARCHITECTURE</h2>
          <p style={{ fontSize: '1.5vw', opacity: 0.5, margin: 0, marginBottom: '3vh', fontFamily: 'monospace' }}>Five integrated components forming the complete national blood grid</p>

          {/* Top row: 3 components */}
          <div style={{ display: 'flex', gap: '2vw', marginBottom: '2vh' }}>
            <div style={{ flex: 1, border: '1px solid rgba(255,255,255,0.3)', padding: '1.8vh 1.5vw', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: '0.7vw', color: '#BAE6FD', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '0.8vh' }}>INTERFACE / DONOR</div>
              <div style={{ fontSize: '1.6vw', fontWeight: 600, marginBottom: '0.8vh', letterSpacing: '0.05em' }}>PULSE</div>
              <div style={{ width: '2vw', height: '1px', background: '#E74C3C', marginBottom: '0.8vh' }} />
              <div style={{ fontSize: '1.3vw', opacity: 0.6, lineHeight: 1.4 }}>Donor registration and tracking portal — web and mobile</div>
            </div>
            <div style={{ flex: 1, border: '1px solid rgba(255,255,255,0.3)', padding: '1.8vh 1.5vw', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: '0.7vw', color: '#BAE6FD', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '0.8vh' }}>INTERFACE / HOSPITAL</div>
              <div style={{ fontSize: '1.6vw', fontWeight: 600, marginBottom: '0.8vh', letterSpacing: '0.05em' }}>SANCTUM</div>
              <div style={{ width: '2vw', height: '1px', background: '#E74C3C', marginBottom: '0.8vh' }} />
              <div style={{ fontSize: '1.3vw', opacity: 0.6, lineHeight: 1.4 }}>Hospital blood bank interface — unit logging and dispatch</div>
            </div>
            <div style={{ flex: 1, border: '1px solid rgba(255,255,255,0.3)', padding: '1.8vh 1.5vw', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: '0.7vw', color: '#BAE6FD', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '0.8vh' }}>INTERFACE / MINISTRY</div>
              <div style={{ fontSize: '1.6vw', fontWeight: 600, marginBottom: '0.8vh', letterSpacing: '0.05em' }}>VIGIL</div>
              <div style={{ width: '2vw', height: '1px', background: '#E74C3C', marginBottom: '0.8vh' }} />
              <div style={{ fontSize: '1.3vw', opacity: 0.6, lineHeight: 1.4 }}>National NBTS dashboard — live inventory, alerts, routing</div>
            </div>
          </div>

          {/* Flow indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2vh', gap: '4vw' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1vw' }}>
              <div style={{ width: '6vw', height: '1px', background: 'rgba(255,255,255,0.3)', borderTop: '1px dashed rgba(255,255,255,0.3)' }} />
              <div style={{ fontSize: '1.5vw', opacity: 0.4, fontFamily: 'monospace' }}>DATA FLOW</div>
              <div style={{ width: '6vw', height: '1px', background: 'rgba(255,255,255,0.3)', borderTop: '1px dashed rgba(255,255,255,0.3)' }} />
            </div>
          </div>

          {/* Bottom row: 2 engine components */}
          <div style={{ display: 'flex', gap: '2vw' }}>
            <div style={{ flex: 1, border: '2px solid rgba(255,255,255,0.4)', padding: '1.8vh 1.5vw', background: 'rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.7vw', color: '#E74C3C', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '0.8vh' }}>ENGINE / ROUTING</div>
              <div style={{ fontSize: '1.6vw', fontWeight: 600, marginBottom: '0.8vh', letterSpacing: '0.05em' }}>TORRENT</div>
              <div style={{ width: '2vw', height: '1px', background: '#E74C3C', marginBottom: '0.8vh' }} />
              <div style={{ fontSize: '1.3vw', opacity: 0.6, lineHeight: 1.4 }}>Algorithmic inter-facility routing — haversine scoring and shortage matching</div>
            </div>
            <div style={{ flex: 1, border: '2px solid rgba(255,255,255,0.4)', padding: '1.8vh 1.5vw', background: 'rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.7vw', color: '#E74C3C', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '0.8vh' }}>ENGINE / LEDGER</div>
              <div style={{ fontSize: '1.6vw', fontWeight: 600, marginBottom: '0.8vh', letterSpacing: '0.05em' }}>STRAND</div>
              <div style={{ width: '2vw', height: '1px', background: '#E74C3C', marginBottom: '0.8vh' }} />
              <div style={{ fontSize: '1.3vw', opacity: 0.6, lineHeight: 1.4 }}>Cryptographic ledger — immutable SHA-256 on-chain event record</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '0.5px solid rgba(255,255,255,0.2)', paddingTop: '1.5vh' }}>
          <div><div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Status</div><div style={{ fontSize: '0.9vw', fontFamily: 'monospace' }}>DEPLOYED</div></div>
          <div><div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Revision</div><div style={{ fontSize: '0.9vw', fontFamily: 'monospace' }}>1.0</div></div>
          <div><div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Page</div><div style={{ fontSize: '0.9vw', fontFamily: 'monospace' }}>04</div></div>
        </div>
      </div>
    </div>
  );
}
