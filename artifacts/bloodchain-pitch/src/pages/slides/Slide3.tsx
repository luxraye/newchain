export default function Slide3() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#1B3A5C', fontFamily: "'Inter', sans-serif", position: 'relative', color: '#FFFFFF' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '2vw 2vh', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '10vw 10vh', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '3vh', left: '3vw', right: '3vw', bottom: '3vh', border: '1px solid rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '5vh', left: '5vw', right: '5vw', bottom: '5vh', border: '0.5px solid rgba(255,255,255,0.1)', pointerEvents: 'none' }} />

      {/* VERIFIED stamp */}
      <div style={{ position: 'absolute', top: '12vh', right: '9vw', border: '0.3vw solid rgba(255,255,255,0.4)', padding: '1vh 1.2vw', color: 'rgba(255,255,255,0.4)', fontSize: '2vw', fontWeight: 700, transform: 'rotate(-12deg)', opacity: 0.7, letterSpacing: '0.2vw', fontFamily: 'monospace', pointerEvents: 'none' }}>
        VERIFIED
      </div>

      <div style={{ padding: '7vh 7vw', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', position: 'relative', boxSizing: 'border-box' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.7vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}>Section 3</div>
            <div style={{ fontSize: '1vw', fontWeight: 600, fontFamily: 'monospace' }}>SOLUTION BRIEF</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}>Ref No.</div>
            <div style={{ fontSize: '1vw', fontFamily: 'monospace' }}>SOL-03X</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '2vh', marginBottom: '2vh' }}>
          <h2 style={{ fontSize: '4vw', fontWeight: 300, margin: 0, letterSpacing: '0.05em', marginBottom: '2vh' }}>THE SOLUTION</h2>
          <p style={{ fontSize: '2vw', opacity: 0.7, margin: 0, marginBottom: '3.5vh', maxWidth: '60vw', lineHeight: 1.5, fontWeight: 300, textWrap: 'pretty' as never }}>
            A cryptographic ledger that tracks every blood unit from donor vein to patient transfusion.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5vh', maxWidth: '68vw' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2vw' }}>
              <div style={{ width: '1.4vw', height: '1.4vw', border: '1px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.3vh' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', background: '#E74C3C' }} />
              </div>
              <p style={{ fontSize: '2vw', lineHeight: 1.45, margin: 0, textWrap: 'pretty' as never }}>Every unit gets a unique chain hash — tamper-proof, traceable, permanent</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2vw' }}>
              <div style={{ width: '1.4vw', height: '1.4vw', border: '1px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.3vh' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', background: '#E74C3C' }} />
              </div>
              <p style={{ fontSize: '2vw', lineHeight: 1.45, margin: 0, textWrap: 'pretty' as never }}>Facilities connect in real time — no more phone calls, no more guesswork</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2vw' }}>
              <div style={{ width: '1.4vw', height: '1.4vw', border: '1px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.3vh' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', background: '#E74C3C' }} />
              </div>
              <p style={{ fontSize: '2vw', lineHeight: 1.45, margin: 0, textWrap: 'pretty' as never }}>Algorithmic routing matches surplus units to shortage facilities automatically</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2vw' }}>
              <div style={{ width: '1.4vw', height: '1.4vw', border: '1px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.3vh' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', background: '#E74C3C' }} />
              </div>
              <p style={{ fontSize: '2vw', lineHeight: 1.45, margin: 0, textWrap: 'pretty' as never }}>Built for the Ministry of Health, Republic of Botswana</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '0.5px solid rgba(255,255,255,0.2)', paddingTop: '1.5vh' }}>
          <div><div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Status</div><div style={{ fontSize: '0.9vw', fontFamily: 'monospace' }}>ACTIVE</div></div>
          <div><div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Revision</div><div style={{ fontSize: '0.9vw', fontFamily: 'monospace' }}>2.0</div></div>
          <div><div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Page</div><div style={{ fontSize: '0.9vw', fontFamily: 'monospace' }}>03</div></div>
        </div>
      </div>
    </div>
  );
}
