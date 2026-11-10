import { useCallback, useEffect, useState } from 'react';

type CounterResponse = { count: number };
const SESSION_KEY = 'worldhealth-visitor-counted';

function App() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadCount = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      let counted = false;
      try {
        counted = window.sessionStorage.getItem(SESSION_KEY) === 'yes';
      } catch {
        counted = false;
      }
      const response = await fetch('/api/visitors', {
        method: counted ? 'GET' : 'POST',
        headers: { Accept: 'application/json' },
        cache: 'no-store'
      });
      if (!response.ok) throw new Error('Visitor counter request failed');
      const data = (await response.json()) as CounterResponse;
      if (!Number.isFinite(data.count)) throw new Error('Invalid visitor count');
      setCount(data.count);
      try {
        window.sessionStorage.setItem(SESSION_KEY, 'yes');
      } catch {
        /* Storage is optional. */
      }
    } catch {
      setErrorMessage('We could not load the global visitor count. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCount();
  }, [loadCount]);

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#home">
          <span className="brand-mark">W</span>
          <span>Worldhealth <strong>Initiatives</strong></span>
        </a>
        <span className="topbar-note">A healthier world, together</span>
      </header>
      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> WELCOME TO OUR COMMUNITY</p>
          <h1>Hello, world.<br /><span>Welcome to</span><br />Worldhealth Initiatives.</h1>
          <p className="intro">
            Every positive change begins with people coming together. We are
            glad you are here and part of a world that believes in a healthier,
            more hopeful future for everyone.
          </p>
          <a className="primary-link" href="#visitors">Meet our global community <span>↘</span></a>
        </div>
        <aside className="welcome-panel" id="visitors" aria-live="polite">
          <div className="panel-topline"><span className="live-dot" /> LIVE COMMUNITY COUNT</div>
          <div className="globe-art" aria-hidden="true">
            <div className="globe-ring" />
            <div className="globe"><i /><b /></div>
            <span className="orbit" />
          </div>
          <p className="counter-label">People who have visited</p>
          <div className="counter-value">{loading ? '•••' : count === null ? '—' : count.toLocaleString()}</div>
          <p className="counter-caption">One world. Many connections.</p>
          {errorMessage && (
            <div className="counter-error" role="alert">
              <p>{errorMessage}</p>
              <button onClick={() => void loadCount()}>Try again</button>
            </div>
          )}
          <div className="panel-footer">GLOBAL VISITOR COUNTER <span className="live-dot" /></div>
        </aside>
      </section>
      <section className="message-strip">
        <span className="strip-icon">✳</span>
        <div>
          <p className="strip-kicker">OUR SHARED BEGINNING</p>
          <h2>Thank you for being here.</h2>
          <p>We are building a space for connection, awareness and meaningful progress.</p>
        </div>
        <span className="strip-decoration">WHI.</span>
      </section>
      <footer className="footer">
        <span>© {new Date().getFullYear()} Worldhealth Initiatives</span>
        <span>Healthier futures start together.</span>
      </footer>
    </main>
  );
}

export default App;