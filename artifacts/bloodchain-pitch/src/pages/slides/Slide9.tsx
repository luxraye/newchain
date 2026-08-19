export default function Slide9() {
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
            <div style={{ fontSize: '0.7vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}>Section 9</div>
            <div style={{ fontSize: '1vw', fontWeight: 600, fontFamily: 'monospace' }}>PARTNERSHIP</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}>Ref No.</div>
            <div style={{ fontSize: '1vw', fontFamily: 'monospace' }}>PAR-09X</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '1.5vh', marginBottom: '1.5vh' }}>
          <h2 style={{ fontSize: '3.2vw', fontWeight: 300, margin: 0, letterSpacing: '0.05em', marginBottom: '0.8vh' }}>THE PARTNERSHIP</h2>
          <p style={{ fontSize: '1.5vw', opacity: 0.5, margin: 0, marginBottom: '3vh', fontFamily: 'monospace' }}>We are seeking</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2vw', marginBottom: '2.5vh' }}>
            <div style={{ border: '1px solid rgba(255,255,255,0.3)', padding: '2vh 1.8vw', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: '0.7vw', color: '#E74C3C', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '0.8vh' }}>GOVERNMENT</div>
              <div style={{ fontSize: '1.6vw', fontWeight: 600, marginBottom: '1vh' }}>Ministry of Health</div>
              <div style={{ width: '2vw', height: '1px', background: 'rgba(255,255,255,0.3)', marginBottom: '1vh' }} />
              <p style={{ fontSize: '1.4vw', margin: 0, lineHeight: 1.45, opacity: 0.75 }}>Formal pilot mandate and NBTS integration authority</p>
            </div>
            <div style={{ border: '1px solid rgba(255,255,255,0.3)', padding: '2vh 1.8vw', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: '0.7vw', color: '#E74C3C', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '0.8vh' }}>HEALTHCARE</div>
              <div style={{ fontSize: '1.6vw', fontWeight: 600, marginBottom: '1vh' }}>Hospital Partners</div>
              <div style={{ width: '2vw', height: '1px', background: 'rgba(255,255,255,0.3)', marginBottom: '1vh' }} />
              <p style={{ fontSize: '1.4vw', margin: 0, lineHeight: 1.45, opacity: 0.75 }}>Blood bank staff onboarding at 3+ Phase I facilities</p>
            </div>
            <div style={{ border: '1px solid rgba(255,255,255,0.3)', padding: '2vh 1.8vw', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: '0.7vw', color: '#E74C3C', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '0.8vh' }}>CAPITAL</div>
              <div style={{ fontSize: '1.6vw', fontWeight: 600, marginBottom: '1vh' }}>Impact Investors</div>
              <div style={{ width: '2vw', height: '1px', background: 'rgba(255,255,255,0.3)', marginBottom: '1vh' }} />
              <p style={{ fontSize: '1.4vw', margin: 0, lineHeight: 1.45, opacity: 0.75 }}>Seed funding for infrastructure, compliance, and team growth</p>
            </div>
            <div style={{ border: '1px solid rgba(255,255,255,0.3)', padding: '2vh 1.8vw', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: '0.7vw', color: '#E74C3C', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '0.8vh' }}>TECHNOLOGY</div>
              <div style={{ fontSize: '1.6vw', fontWeight: 600, marginBottom: '1vh' }}>Technology Partners</div>
              <div style={{ width: '2vw', height: '1px', background: 'rgba(255,255,255,0.3)', marginBottom: '1vh' }} />
              <p style={{ fontSize: '1.4vw', margin: 0, lineHeight: 1.45, opacity: 0.75 }}>Cloud hosting credits, security audit, EHR integration</p>
            </div>
          </div>

          <div style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '1.5vh 2vw', background: 'rgba(255,255,255,0.04)' }}>
            <p style={{ fontSize: '1.6vw', margin: 0, lineHeight: 1.5, opacity: 0.8, textWrap: 'pretty' as never }}>
              What we offer: full data sovereignty, white-label capability, built for the Botswana context
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '0.5px solid rgba(255,255,255,0.2)', paddingTop: '1.5vh' }}>
          <div><div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Status</div><div style={{ fontSize: '0.9vw', fontFamily: 'monospace' }}>SEEKING</div></div>
          <div><div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Revision</div><div style={{ fontSize: '0.9vw', fontFamily: 'monospace' }}>1.0</div></div>
          <div><div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Page</div><div style={{ fontSize: '0.9vw', fontFamily: 'monospace' }}>09</div></div>
        </div>
      </div>
    </div>
  );
}
