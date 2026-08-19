export default function Slide6() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#1B3A5C', color: '#FFFFFF', fontFamily: "'Courier New', Courier, monospace", position: 'relative', boxSizing: 'border-box' }}>
      {/* Grids */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '2vw 2vh', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '10vw 10vh', pointerEvents: 'none' }} />
      {/* Borders */}
      <div style={{ position: 'absolute', top: '3vh', left: '3vw', right: '3vw', bottom: '3vh', border: '1px solid rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '4vh', left: '4vw', right: '4vw', bottom: '4vh', border: '2px solid rgba(255,255,255,0.5)', pointerEvents: 'none' }} />

      {/* Title */}
      <div style={{ position: 'absolute', top: '8vh', left: '8vw' }}>
        <h1 style={{ fontSize: '3.5vw', fontWeight: 'bold', margin: 0, letterSpacing: '0.1vw', color: '#E0F2FE', textShadow: '0 0 5px rgba(224,242,254,0.5)' }}>TECHNICAL SPECIFICATIONS</h1>
        <div style={{ fontSize: '1.2vw', color: '#BAE6FD', marginTop: '0.8vh', letterSpacing: '0.05vw' }}>DOCUMENT REF: T-SPEC-001</div>
      </div>

      {/* REV stamp */}
      <div style={{ position: 'absolute', top: '8vh', right: '8vw', border: '0.3vw solid #E74C3C', padding: '0.8vh 1vw', color: '#E74C3C', fontSize: '1.8vw', fontWeight: 'bold', transform: 'rotate(15deg)', opacity: 0.8, letterSpacing: '0.2vw', pointerEvents: 'none' }}>
        REV 1.0
      </div>

      {/* Specs table */}
      <div style={{ position: 'absolute', top: '24vh', left: '8vw', right: '8vw', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5vh 6vw' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', fontSize: '1.5vw' }}>
          <span style={{ color: '#BAE6FD', whiteSpace: 'nowrap' }}>Stack</span>
          <div style={{ flexGrow: 1, borderBottom: '0.15vw dotted rgba(255,255,255,0.3)', margin: '0 0.8vw', position: 'relative', top: '-0.3vw' }} />
          <span style={{ color: '#FFFFFF', fontWeight: 'bold', whiteSpace: 'nowrap' }}>PostgreSQL · Drizzle · Express · React</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', fontSize: '1.5vw' }}>
          <span style={{ color: '#BAE6FD', whiteSpace: 'nowrap' }}>Mobile</span>
          <div style={{ flexGrow: 1, borderBottom: '0.15vw dotted rgba(255,255,255,0.3)', margin: '0 0.8vw', position: 'relative', top: '-0.3vw' }} />
          <span style={{ color: '#FFFFFF', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Expo (React Native)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', fontSize: '1.5vw' }}>
          <span style={{ color: '#BAE6FD', whiteSpace: 'nowrap' }}>Auth</span>
          <div style={{ flexGrow: 1, borderBottom: '0.15vw dotted rgba(255,255,255,0.3)', margin: '0 0.8vw', position: 'relative', top: '-0.3vw' }} />
          <span style={{ color: '#FFFFFF', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Donor ID — no PII required</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', fontSize: '1.5vw' }}>
          <span style={{ color: '#BAE6FD', whiteSpace: 'nowrap' }}>Ledger</span>
          <div style={{ flexGrow: 1, borderBottom: '0.15vw dotted rgba(255,255,255,0.3)', margin: '0 0.8vw', position: 'relative', top: '-0.3vw' }} />
          <span style={{ color: '#FFFFFF', fontWeight: 'bold', whiteSpace: 'nowrap' }}>SHA-256 · append-only</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', fontSize: '1.5vw' }}>
          <span style={{ color: '#BAE6FD', whiteSpace: 'nowrap' }}>API</span>
          <div style={{ flexGrow: 1, borderBottom: '0.15vw dotted rgba(255,255,255,0.3)', margin: '0 0.8vw', position: 'relative', top: '-0.3vw' }} />
          <span style={{ color: '#FFFFFF', fontWeight: 'bold', whiteSpace: 'nowrap' }}>RESTful · JSON · TLS-encrypted</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', fontSize: '1.5vw' }}>
          <span style={{ color: '#BAE6FD', whiteSpace: 'nowrap' }}>Donor ID</span>
          <div style={{ flexGrow: 1, borderBottom: '0.15vw dotted rgba(255,255,255,0.3)', margin: '0 0.8vw', position: 'relative', top: '-0.3vw' }} />
          <span style={{ color: '#FFFFFF', fontWeight: 'bold', whiteSpace: 'nowrap' }}>D-YYYY-NNNN</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', fontSize: '1.5vw' }}>
          <span style={{ color: '#BAE6FD', whiteSpace: 'nowrap' }}>Deployment</span>
          <div style={{ flexGrow: 1, borderBottom: '0.15vw dotted rgba(255,255,255,0.3)', margin: '0 0.8vw', position: 'relative', top: '-0.3vw' }} />
          <span style={{ color: '#FFFFFF', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Cloud · scalable · TLS</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', fontSize: '1.5vw' }}>
          <span style={{ color: '#BAE6FD', whiteSpace: 'nowrap' }}>Unit ID</span>
          <div style={{ flexGrow: 1, borderBottom: '0.15vw dotted rgba(255,255,255,0.3)', margin: '0 0.8vw', position: 'relative', top: '-0.3vw' }} />
          <span style={{ color: '#FFFFFF', fontWeight: 'bold', whiteSpace: 'nowrap' }}>BW-YYYY-NNNNNN</span>
        </div>
      </div>

      {/* Engineering title block — bottom right */}
      <div style={{ position: 'absolute', bottom: '4vh', right: '4vw', width: '38vw', border: '2px solid rgba(255,255,255,0.5)', borderRight: 'none', borderBottom: 'none', backgroundColor: 'rgba(27,58,92,0.95)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.5)' }}>
          <div style={{ flex: 1, padding: '0.5vh 0.6vw' }}>
            <div style={{ fontSize: '0.6vw', color: '#BAE6FD' }}>PROJECT:</div>
            <div style={{ fontSize: '1.1vw', fontWeight: 'bold' }}>BLOODCHAIN NATIONAL GRID</div>
          </div>
        </div>
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.5)' }}>
          <div style={{ flex: 2, padding: '0.5vh 0.6vw', borderRight: '1px solid rgba(255,255,255,0.5)' }}>
            <div style={{ fontSize: '0.6vw', color: '#BAE6FD' }}>CLIENT:</div>
            <div style={{ fontSize: '1vw' }}>MINISTRY OF HEALTH, BOTSWANA</div>
          </div>
          <div style={{ flex: 1, padding: '0.5vh 0.6vw' }}>
            <div style={{ fontSize: '0.6vw', color: '#BAE6FD' }}>DATE:</div>
            <div style={{ fontSize: '1vw' }}>2026-08-18</div>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1, padding: '0.5vh 0.6vw', borderRight: '1px solid rgba(255,255,255,0.5)' }}>
            <div style={{ fontSize: '0.6vw', color: '#BAE6FD' }}>DRAWN BY:</div>
            <div style={{ fontSize: '1vw' }}>Gift Jr Nakedi</div>
          </div>
          <div style={{ flex: 1, padding: '0.5vh 0.6vw', borderRight: '1px solid rgba(255,255,255,0.5)' }}>
            <div style={{ fontSize: '0.6vw', color: '#BAE6FD' }}>CHK BY:</div>
            <div style={{ fontSize: '1vw' }}>FOUNDER</div>
          </div>
          <div style={{ flex: 1, padding: '0.5vh 0.6vw' }}>
            <div style={{ fontSize: '0.6vw', color: '#BAE6FD' }}>PAGE:</div>
            <div style={{ fontSize: '1.3vw', fontWeight: 'bold' }}>06</div>
          </div>
        </div>
      </div>

      {/* Confidential footer */}
      <div style={{ position: 'absolute', bottom: '1vh', left: '5vw', fontSize: '0.8vw', color: '#BAE6FD', letterSpacing: '0.1vw' }}>
        Bloodchain / Restricted Distribution
      </div>
    </div>
  );
}
