import React from 'react';

interface EpicCardProps {
  epic: any;
}

const EpicCard: React.FC<EpicCardProps> = ({ epic }) => {
  const getStatusClass = (status: string) => {
    if (!status) return '';
    const normalized = status.toLowerCase().replace(/\s+/g, '-');
    return normalized;
  };

  const getPriorityClass = (priority: string) => {
    if (!priority) return '';
    if (priority.includes('P0') || priority.includes('Critical')) return 'high';
    if (priority.includes('P1') || priority.includes('High')) return 'high';
    if (priority.includes('P2') || priority.includes('Medium')) return 'medium';
    if (priority.includes('P3') || priority.includes('Low')) return 'low';
    return '';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="epic-card">
      <div className="item-header">
        <div>
          <div className="item-title">{epic.Name}</div>
        </div>
        <div>
          {epic.Status__c && (
            <span className={`badge status ${getStatusClass(epic.Status__c)}`}>
              {epic.Status__c}
            </span>
          )}
          {epic.Priority__c && (
            <span className={`badge priority ${getPriorityClass(epic.Priority__c)}`}>
              {epic.Priority__c}
            </span>
          )}
        </div>
      </div>

      {epic.Description__c && (
        <div className="item-description">{epic.Description__c}</div>
      )}

      <div className="item-meta">
        {epic.Target_Date__c && (
          <span>Target: {formatDate(epic.Target_Date__c)}</span>
        )}
        {epic.LastModifiedDate && (
          <span>Updated: {formatDate(epic.LastModifiedDate)}</span>
        )}
      </div>
    </div>
  );
};

export default EpicCard;
