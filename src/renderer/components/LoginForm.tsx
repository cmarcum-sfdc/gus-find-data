import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (credentials: any) => Promise<{ success: boolean; error?: string }>;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [securityToken, setSecurityToken] = useState('');
  const [instanceUrl, setInstanceUrl] = useState('https://login.salesforce.com');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await onLogin({
        username,
        password,
        securityToken,
        instanceUrl,
      });

      if (!result.success) {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login to Salesforce</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your-email@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="securityToken">Security Token</label>
          <input
            id="securityToken"
            type="password"
            value={securityToken}
            onChange={(e) => setSecurityToken(e.target.value)}
            placeholder="Your Salesforce security token"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="instanceUrl">Instance URL</label>
          <input
            id="instanceUrl"
            type="text"
            value={instanceUrl}
            onChange={(e) => setInstanceUrl(e.target.value)}
            placeholder="https://login.salesforce.com"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
