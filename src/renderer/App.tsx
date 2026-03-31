import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import SearchPanel from './components/SearchPanel';
import ResultsPanel from './components/ResultsPanel';
import './styles.css';

type ViewMode = 'work' | 'epics';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('work');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const authenticated = await window.electronAPI.isAuthenticated();
      setIsAuthenticated(authenticated);
    } catch (error) {
      console.error('Error checking authentication:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (credentials: any) => {
    const result = await window.electronAPI.login(credentials);
    if (result.success) {
      setIsAuthenticated(true);
      return { success: true };
    }
    return result;
  };

  const handleLogout = async () => {
    await window.electronAPI.logout();
    setIsAuthenticated(false);
    setResults([]);
  };

  const handleSearch = async (searchParams: any) => {
    setIsSearching(true);
    try {
      let result;
      if (viewMode === 'work') {
        result = await window.electronAPI.queryWork(searchParams);
      } else {
        result = await window.electronAPI.queryEpics(searchParams);
      }

      if (result.success) {
        setResults(result.data);
      } else {
        console.error('Search failed:', result.error);
        alert('Search failed: ' + result.error);
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Search error: ' + (error as Error).message);
    } finally {
      setIsSearching(false);
    }
  };

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="app">
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>GUS Finder</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <div className="main-content">
        <SearchPanel
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onSearch={handleSearch}
          isSearching={isSearching}
        />
        <ResultsPanel
          viewMode={viewMode}
          results={results}
          isSearching={isSearching}
        />
      </div>
    </div>
  );
};

export default App;
