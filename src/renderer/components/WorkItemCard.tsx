import React from 'react';

interface WorkItemCardProps {
  item: any;
}

const WorkItemCard: React.FC<WorkItemCardProps> = ({ item }) => {
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
    <div className="work-item-card">
      <div className="item-header">
        <div>
          <div className="item-title">{item.Subject__c || item.Name}</div>
          <div className="item-name">{item.Name}</div>
        </div>
        <div>
          {item.Status__c && (
            <span className={`badge status ${getStatusClass(item.Status__c)}`}>
              {item.Status__c}
            </span>
          )}
          {item.Priority__c && (
            <span className={`badge priority ${getPriorityClass(item.Priority__c)}`}>
              {item.Priority__c}
            </span>
          )}
        </div>
      </div>

      {item.Details_and_Steps_to_Reproduce__c && (
        <div className="item-description">
          {item.Details_and_Steps_to_Reproduce__c}
        </div>
      )}

      <div className="item-meta">
        {item.Type__c && <span>Type: {item.Type__c}</span>}
        {item.Assignee__c && <span>Assignee: {item.Assignee__c}</span>}
        {item.Sprint__c && <span>Sprint: {item.Sprint__c}</span>}
        {item.LastModifiedDate && (
          <span>Updated: {formatDate(item.LastModifiedDate)}</span>
        )}
      </div>
    </div>
  );
};

export default WorkItemCard;
