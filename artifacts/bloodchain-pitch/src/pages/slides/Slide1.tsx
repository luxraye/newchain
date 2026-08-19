export default function Slide1() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#1B3A5C', fontFamily: "'Inter', sans-serif", position: 'relative', color: '#FFFFFF' }}>
      {/* Fine grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '2vw 2vh', pointerEvents: 'none' }} />
      {/* Coarse grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '10vw 10vh', pointerEvents: 'none' }} />
      {/* Outer border */}
      <div style={{ position: 'absolute', top: '3vh', left: '3vw', right: '3vw', bottom: '3vh', border: '1px solid rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
      {/* Inner border */}
      <div style={{ position: 'absolute', top: '5vh', left: '5vw', right: '5vw', bottom: '5vh', border: '0.5px solid rgba(255,255,255,0.1)', pointerEvents: 'none' }} />

      {/* Crimson accent bar — left edge */}
      <div style={{ position: 'absolute', top: '20vh', left: '3vw', width: '0.3vw', height: '45vh', background: '#E74C3C', opacity: 0.8 }} />

      <div style={{ padding: '7vh 7vw', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', position: 'relative', boxSizing: 'border-box' }}>
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.7vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}>Drawing No.</div>
            <div style={{ fontSize: '1vw', fontWeight: 600, fontFamily: 'monospace' }}>BC-DCK-001</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}>Date</div>
            <div style={{ fontSize: '1vw', fontFamily: 'monospace' }}>2026-08-18</div>
          </div>
        </div>

        {/* Main title block */}
        <div>
          <div style={{ fontSize: '0.8vw', textTransform: 'uppercase', letterSpacing: '0.3em', opacity: 0.5, marginBottom: '1.5vh' }}>
            Project Title
          </div>
          <h1 style={{ fontSize: '7vw', fontWeight: 300, lineHeight: 0.9, margin: 0, letterSpacing: '0.05em' }}>
            BLOOD
          </h1>
          <h1 style={{ fontSize: '7vw', fontWeight: 300, lineHeight: 0.9, margin: 0, letterSpacing: '0.05em' }}>
            CHAIN
          </h1>
          <div style={{ width: '8vw', height: '1px', background: '#E74C3C', marginTop: '2vh' }} />
          <p style={{ fontSize: '1.2vw', opacity: 0.6, marginTop: '1.5vh', maxWidth: '42vw', lineHeight: 1.6, fontWeight: 300, textWrap: 'pretty' as never }}>
            National sovereign infrastructure for cryptographic tracking and algorithmic distribution of the blood supply.
          </p>
          <p style={{ fontSize: '1vw', opacity: 0.4, marginTop: '1vh', fontFamily: 'monospace' }}>
            Ministry of Health, Republic of Botswana
          </p>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '0.5px solid rgba(255,255,255,0.2)', paddingTop: '1.5vh' }}>
          <div>
            <div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Prepared By</div>
            <div style={{ fontSize: '0.9vw', fontFamily: 'monospace' }}>Gift Jr Nakedi, Founder</div>
          </div>
          <div>
            <div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Classification</div>
            <div style={{ fontSize: '0.9vw', fontFamily: 'monospace' }}>RESTRICTED</div>
          </div>
          <div>
            <div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Scale</div>
            <div style={{ fontSize: '0.9vw', fontFamily: 'monospace' }}>1:1</div>
          </div>
        </div>
      </div>
    </div>
  );
}
