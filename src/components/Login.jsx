import { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const submit = e => {
    e.preventDefault();
    const ok = onLogin(username, password);
    if (ok) { setUsername(''); setPassword(''); setError(false); }
    else setError(true);
  };

  return (
    <section className="view">
      <div className="login-wrap">
        <div className="panel-card login-card">
          <p className="hero-eyebrow">Staff Member Access</p>
          <h2 className="login-title">Sign in to Wisdom Archives</h2>
          <form onSubmit={submit}>
            <div className="field">
              <label htmlFor="loginUsername">Username</label>
              <input id="loginUsername" type="text" required autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="loginPassword">Password</label>
              <input id="loginPassword" type="password" required autoComplete="current-password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {error && <p className="form-error">Username or password is incorrect. Please try again.</p>}
            <button type="submit" className="btn btn-primary btn-block">Log In</button>
          </form>
        </div>
      </div>
    </section>
  );
}
