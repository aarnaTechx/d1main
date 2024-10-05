import React, { useState } from 'react';
import EvaluationsTable from './EvaluationsTable';
import { Evaluation, EvaluationsByStatus } from '../types/types'; // Adjust path as needed

interface DashboardTabsProps {
  evaluations: EvaluationsByStatus; // Use the shared type here
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ evaluations }) => {
  const [activeTab, setActiveTab] = useState<'Requested' | 'Accepted' | 'Completed' | 'Declined'>('Requested');

  const tabs = [
    { id: 'Requested', label: 'Requested' },
    { id: 'Accepted', label: 'Accepted' },
    { id: 'Completed', label: 'Completed' },
    { id: 'Declined', label: 'Declined' },
  ];

  const activeEvaluations = evaluations[activeTab] || [];

  return (
    <div className="flex flex-col mt-4">
      <div className="flex justify-center items-center space-x-4 border-b pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`p-2 font-semibold ${activeTab === tab.id ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4">
        <EvaluationsTable data={activeEvaluations} />
      </div>
    </div>
  );
};

export default DashboardTabs;
