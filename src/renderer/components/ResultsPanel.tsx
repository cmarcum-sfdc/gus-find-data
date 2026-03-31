import React from 'react';
import WorkItemCard from './WorkItemCard';
import EpicCard from './EpicCard';

interface ResultsPanelProps {
  viewMode: 'work' | 'epics';
  results: any[];
  isSearching: boolean;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({
  viewMode,
  results,
  isSearching,
}) => {
  if (isSearching) {
    return (
      <div className="results-panel">
        <div className="loading">Searching...</div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="results-panel">
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-text">
            {viewMode === 'work'
              ? 'No work items found. Try adjusting your search filters.'
              : 'No epics found. Try adjusting your search filters.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="results-panel">
      <div className="results-header">
        <h2>{viewMode === 'work' ? 'Work Items' : 'Epics'}</h2>
        <div className="results-count">
          {results.length} {results.length === 1 ? 'result' : 'results'}
        </div>
      </div>

      <div className="results-list">
        {viewMode === 'work'
          ? results.map((item) => <WorkItemCard key={item.Id} item={item} />)
          : results.map((item) => <EpicCard key={item.Id} epic={item} />)}
      </div>
    </div>
  );
};

export default ResultsPanel;
