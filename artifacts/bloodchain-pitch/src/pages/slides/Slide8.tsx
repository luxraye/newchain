import founderPhoto from '@assets/image_1787077174171.png';

export default function Slide8() {
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
            <div style={{ fontSize: '0.7vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}>Section 8</div>
            <div style={{ fontSize: '1vw', fontWeight: 600, fontFamily: 'monospace' }}>TEAM OVERVIEW</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}>Ref No.</div>
            <div style={{ fontSize: '1vw', fontFamily: 'monospace' }}>TEA-08X</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '1.5vh', marginBottom: '1.5vh' }}>
          <h2 style={{ fontSize: '3.2vw', fontWeight: 300, margin: 0, letterSpacing: '0.05em', marginBottom: '3vh' }}>THE TEAM</h2>

          <div style={{ display: 'flex', gap: '4vw', alignItems: 'stretch' }}>
            {/* Photo */}
            <div style={{ width: '22vw', flexShrink: 0, border: '2px solid rgba(255,255,255,0.3)', overflow: 'hidden', position: 'relative' }}>
              <img crossOrigin="anonymous" src={founderPhoto} alt="Gift Jr Nakedi — Founder" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(27,58,92,0.85))', padding: '1.5vh 1vw 0.8vh' }}>
                <div style={{ fontSize: '0.7vw', color: '#BAE6FD', fontFamily: 'monospace', letterSpacing: '0.1em' }}>FOUNDER</div>
              </div>
            </div>

            {/* Bio */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ fontSize: '2.5vw', fontWeight: 600, margin: 0, marginBottom: '0.5vh' }}>Gift Jr Nakedi</h3>
              <div style={{ fontSize: '1.2vw', color: '#E74C3C', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Founder & Lead Developer</div>
              <div style={{ width: '6vw', height: '1px', background: '#E74C3C', marginBottom: '2.5vh' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5vh', marginBottom: '3vh' }}>
                <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
                  <div style={{ width: '0.4vw', height: '0.4vw', borderRadius: '50%', background: 'rgba(255,255,255,0.5)', marginTop: '0.8vh', flexShrink: 0 }} />
                  <p style={{ fontSize: '1.8vw', margin: 0, lineHeight: 1.4, opacity: 0.9 }}>Visionary technologist and health infrastructure advocate</p>
                </div>
                <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
                  <div style={{ width: '0.4vw', height: '0.4vw', borderRadius: '50%', background: 'rgba(255,255,255,0.5)', marginTop: '0.8vh', flexShrink: 0 }} />
                  <p style={{ fontSize: '1.8vw', margin: 0, lineHeight: 1.4, opacity: 0.9 }}>Building the cryptographic backbone of Botswana's national blood supply</p>
                </div>
                <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
                  <div style={{ width: '0.4vw', height: '0.4vw', borderRadius: '50%', background: 'rgba(255,255,255,0.5)', marginTop: '0.8vh', flexShrink: 0 }} />
                  <p style={{ fontSize: '1.8vw', margin: 0, lineHeight: 1.4, opacity: 0.9 }}>Based in Gaborone, Botswana</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '3vw', borderTop: '0.5px solid rgba(255,255,255,0.2)', paddingTop: '2vh' }}>
                <div>
                  <div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4, marginBottom: '0.3vh' }}>Email</div>
                  <div style={{ fontSize: '1.3vw', fontFamily: 'monospace' }}>giftjrnakedi@gmail.com</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4, marginBottom: '0.3vh' }}>Location</div>
                  <div style={{ fontSize: '1.3vw', fontFamily: 'monospace' }}>Gaborone, Botswana</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '0.5px solid rgba(255,255,255,0.2)', paddingTop: '1.5vh' }}>
          <div><div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Status</div><div style={{ fontSize: '0.9vw', fontFamily: 'monospace' }}>VERIFIED</div></div>
          <div><div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Revision</div><div style={{ fontSize: '0.9vw', fontFamily: 'monospace' }}>1.0</div></div>
          <div><div style={{ fontSize: '0.6vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Page</div><div style={{ fontSize: '0.9vw', fontFamily: 'monospace' }}>08</div></div>
        </div>
      </div>
    </div>
  );
}
