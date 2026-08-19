export default function Slide2() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#1B3A5C', fontFamily: "'Inter', sans-serif", position: 'relative', color: '#FFFFFF' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '2vw 2vh', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '10vw 10vh', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '3vh', left: '3vw', right: '3vw', bottom: '3vh', border: '1px solid rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '5vh', left: '5vw', right: '5vw', bottom: '5vh', border: '0.5px solid rgba(255,255,255,0.1)', pointerEvents: 'none' }} />

      {/* CRITICAL stamp */}
      <div style={{ position: 'absolute', top: '12vh', right: '9vw', border: '0.3vw solid #E74C3C', padding: '1vh 1.2vw', color: '#E74C3C', fontSize: '2vw', fontWeight: 700, transform: 'rotate(15deg)', opacity: 0.75, letterSpacing: '0.2vw', fontFamily: 'monospace', pointerEvents: 'none' }}>
        CRITICAL
      </div>

      <div style={{ padding: '7vh 7vw', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', position: 'relative', boxSizing: 'border-box' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.7vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}>Section 2</div>
            <div style={{ fontSize: '1vw', fontWeight: 600, fontFamily: 'monospace' }}>PROBLEM STATEMENT</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}>Ref No.</div>
            <div style={{ fontSize: '1vw', fontFamily: 'monospace' }}>PRB-02X</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '2vh', marginBottom: '2vh' }}>
          <h2 style={{ fontSize: '4vw', fontWeight: 300, margin: 0, letterSpacing: '0.05em', marginBottom: '4vh' }}>THE PROBLEM</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5vh', maxWidth: '68vw' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2vw' }}>
              <div style={{ width: '0.4vw', height: '2.5vh', background: '#E74C3C', flexShrink: 0, marginTop: '0.3vh' }} />
              <p style={{ fontSize: '2vw', lineHeight: 1.45, margin: 0, opacity: 0.9, textWrap: 'pretty' as never }}>Every year, preventable deaths occur because blood is in the wrong place at the wrong time</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2vw' }}>
              <div style={{ width: '0.4vw', height: '2.5vh', background: '#E74C3C', flexShrink: 0, marginTop: '0.3vh' }} />
              <p style={{ fontSize: '2vw', lineHeight: 1.45, margin: 0, opacity: 0.9, textWrap: 'pretty' as never }}>Botswana's hospitals operate on paper manifests, verbal transfers, and fragmented databases</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2vw' }}>
              <div style={{ width: '0.4vw', height: '2.5vh', background: '#E74C3C', flexShrink: 0, marginTop: '0.3vh' }} />
              <p style={{ fontSize: '2vw', lineHeight: 1.45, margin: 0, opacity: 0.9, textWrap: 'pretty' as never }}>No facility knows what another has in real time</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2vw' }}>
              <div style={{ width: '0.4vw', height: '2.5vh', background: '#E74C3C', flexShrink: 0, marginTop: '0.3vh' }} />
              <p style={{ fontSize: '2vw', lineHeight: 1.45, margin: 0, opacity: 0.9, textWrap: 'pretty' as never }}>Expired units are discarded; critical shortages go undetected until a patient arrives</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2vw' }}>
              <div style={{ width: '0.4vw', height: '2.5vh', background: '#E74C3C', flexShrink: 0, marginTop: '0.3vh' }} />
              <p style={{ fontSize: '2vw', lineHeight: 1.45, margin: 0, opacity: 0.9, textWrap: 'pretty' as never }}>The national blood supply is treated as a logistics afterthought, not sovereign infrastructure</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '0.5px solid rgba(255,255,255,0.2)', paddingTop: '1.5vh' }}>
          <div><div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Status</div><div style={{ fontSize: '0.9vw', fontFamily: 'monospace', color: '#E74C3C' }}>CRITICAL</div></div>
          <div><div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Revision</div><div style={{ fontSize: '0.9vw', fontFamily: 'monospace' }}>1.0</div></div>
          <div><div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Page</div><div style={{ fontSize: '0.9vw', fontFamily: 'monospace' }}>02</div></div>
        </div>
      </div>
    </div>
  );
}
