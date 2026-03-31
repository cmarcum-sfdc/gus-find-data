import React, { useState } from 'react';

interface SearchPanelProps {
  viewMode: 'work' | 'epics';
  onViewModeChange: (mode: 'work' | 'epics') => void;
  onSearch: (params: any) => void;
  isSearching: boolean;
}

const SearchPanel: React.FC<SearchPanelProps> = ({
  viewMode,
  onViewModeChange,
  onSearch,
  isSearching,
}) => {
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [assignee, setAssignee] = useState('');

  const handleSearch = () => {
    const params: any = {
      searchText: searchText.trim() || undefined,
      status: status || undefined,
      priority: priority || undefined,
      limit: 100,
    };

    if (viewMode === 'work' && assignee) {
      params.assignee = assignee.trim();
    }

    onSearch(params);
  };

  const handleClear = () => {
    setSearchText('');
    setStatus('');
    setPriority('');
    setAssignee('');
  };

  return (
    <div className="search-panel">
      <div className="tab-buttons">
        <button
          className={`tab-button ${viewMode === 'work' ? 'active' : ''}`}
          onClick={() => onViewModeChange('work')}
        >
          Work Items
        </button>
        <button
          className={`tab-button ${viewMode === 'epics' ? 'active' : ''}`}
          onClick={() => onViewModeChange('epics')}
        >
          Epics
        </button>
      </div>

      <h3>Search Filters</h3>

      <div className="form-group">
        <label htmlFor="searchText">Search Text</label>
        <input
          id="searchText"
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder={viewMode === 'work' ? 'Search work items...' : 'Search epics...'}
        />
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="New">New</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Closed">Closed</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="">All</option>
          <option value="P0">P0 - Critical</option>
          <option value="P1">P1 - High</option>
          <option value="P2">P2 - Medium</option>
          <option value="P3">P3 - Low</option>
        </select>
      </div>

      {viewMode === 'work' && (
        <div className="form-group">
          <label htmlFor="assignee">Assignee</label>
          <input
            id="assignee"
            type="text"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="Search by assignee..."
          />
        </div>
      )}

      <button
        className="btn-primary btn-search"
        onClick={handleSearch}
        disabled={isSearching}
      >
        {isSearching ? 'Searching...' : 'Search'}
      </button>

      <button
        className="btn-primary btn-search"
        onClick={handleClear}
        style={{ marginTop: '8px', background: '#666' }}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default SearchPanel;
