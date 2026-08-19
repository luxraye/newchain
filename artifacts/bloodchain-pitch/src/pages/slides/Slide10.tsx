export default function Slide10() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#1B3A5C', fontFamily: "'Inter', sans-serif", position: 'relative', color: '#FFFFFF' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '2vw 2vh', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '10vw 10vh', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '3vh', left: '3vw', right: '3vw', bottom: '3vh', border: '1px solid rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '5vh', left: '5vw', right: '5vw', bottom: '5vh', border: '0.5px solid rgba(255,255,255,0.1)', pointerEvents: 'none' }} />

      <div style={{ padding: '7vh 7vw', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', position: 'relative', boxSizing: 'border-box' }}>
        {/* Top label */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.7vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}>Section 10</div>
            <div style={{ fontSize: '1vw', fontWeight: 600, fontFamily: 'monospace' }}>EXECUTION SUMMARY</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}>Ref No.</div>
            <div style={{ fontSize: '1vw', fontFamily: 'monospace' }}>END-10X</div>
          </div>
        </div>

        {/* Main CTA content — centered */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', marginTop: '2vh', marginBottom: '2vh' }}>
          {/* Terminal circle */}
          <div style={{ width: '12vw', height: '12vw', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4vh', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: '-1vw', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '50%' }} />
            <div style={{ width: '7vw', height: '7vw', border: '2px solid #E74C3C', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(231,76,60,0.08)' }}>
              <div style={{ fontSize: '2.5vw', fontWeight: 300, fontFamily: 'monospace' }}>&gt;_</div>
            </div>
          </div>

          <h1 style={{ fontSize: '4.5vw', fontWeight: 300, margin: 0, letterSpacing: '0.1em' }}>INITIATE BUILD</h1>
          <div style={{ width: '12vw', height: '1px', background: '#E74C3C', margin: '2.5vh 0' }} />

          <p style={{ fontSize: '1.8vw', opacity: 0.7, maxWidth: '50vw', lineHeight: 1.6, fontWeight: 300, margin: 0, marginBottom: '4vh', textWrap: 'pretty' as never }}>
            Bloodchain is live. The infrastructure exists. The blood supply is waiting.
            Let's deploy it together.
          </p>

          <div style={{ display: 'flex', gap: '2vw' }}>
            <div style={{ border: '1px solid rgba(255,255,255,0.4)', padding: '1.5vh 3vw', background: 'rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '18vw' }}>
              <div style={{ fontSize: '0.7vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5, marginBottom: '0.8vh' }}>Primary Contact</div>
              <div style={{ fontSize: '1.2vw', fontFamily: 'monospace' }}>giftjrnakedi@gmail.com</div>
            </div>
            <div style={{ border: '1px solid rgba(255,255,255,0.4)', padding: '1.5vh 3vw', background: 'rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '18vw' }}>
              <div style={{ fontSize: '0.7vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5, marginBottom: '0.8vh' }}>Web</div>
              <div style={{ fontSize: '1.2vw', fontFamily: 'monospace' }}>bw.bloodchain.app</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '0.5px solid rgba(255,255,255,0.2)', paddingTop: '1.5vh' }}>
          <div><div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Status</div><div style={{ fontSize: '0.9vw', fontFamily: 'monospace' }}>FINAL</div></div>
          <div><div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Authorization</div><div style={{ fontSize: '0.9vw', fontFamily: 'monospace' }}>REQUIRED</div></div>
          <div><div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Page</div><div style={{ fontSize: '0.9vw', fontFamily: 'monospace' }}>10</div></div>
        </div>
      </div>
    </div>
  );
}
