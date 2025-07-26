import React from 'react';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color}`}>
      <React.Suspense fallback={<div className="w-6 h-6" />}>
        {icon}
      </React.Suspense>
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default StatCard;
