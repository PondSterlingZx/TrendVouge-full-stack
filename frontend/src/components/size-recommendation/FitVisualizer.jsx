import React from 'react';
import { motion } from 'framer-motion';

const FitIndicator = ({ measurement, actual, recommended, tolerance }) => {
  const diff = actual - recommended;
  const fitStatus = Math.abs(diff) <= tolerance ? 'perfect' 
    : diff > 0 ? 'tight' : 'loose';

  const statusColors = {
    perfect: 'bg-green-500',
    tight: 'bg-orange-500',
    loose: 'bg-blue-500'
  };

  const statusDescriptions = {
    perfect: 'Perfect fit',
    tight: 'May feel tight',
    loose: 'May feel loose'
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">{measurement}</span>
        <span className="text-sm text-gray-500">
          {statusDescriptions[fitStatus]}
        </span>
      </div>
      
      <div className="relative h-2 bg-gray-100 rounded-full">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(actual / recommended) * 100}%` }}
          className={`absolute h-full rounded-full ${statusColors[fitStatus]}`}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>{Math.min(actual, recommended)}cm</span>
        <span>{Math.max(actual, recommended)}cm</span>
      </div>
    </div>
  );
};

const DetailedMeasurements = ({ measurements }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Object.entries(measurements).map(([key, value]) => (
        <div key={key} className="p-3 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium">{key}</div>
          <div className="text-lg">{value}cm</div>
        </div>
      ))}
    </div>
  );
};

export const FitVisualizer = ({ 
  productMeasurements, 
  userMeasurements, 
  tolerances 
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {Object.keys(productMeasurements).map(measurement => (
          <FitIndicator
            key={measurement}
            measurement={measurement}
            actual={userMeasurements[measurement]}
            recommended={productMeasurements[measurement]}
            tolerance={tolerances[measurement] || 2}
          />
        ))}
      </div>

      <div className="border-t pt-6">
        <h4 className="font-medium mb-4">Detailed Measurements</h4>
        <DetailedMeasurements measurements={userMeasurements} />
      </div>
    </div>
  );
};