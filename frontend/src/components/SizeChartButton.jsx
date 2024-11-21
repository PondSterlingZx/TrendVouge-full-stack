import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

// Size Chart Popup Component
const SizeChartPopup = ({ onClose }) => {
  const [unit, setUnit] = useState('cm');

  const SIZE_DATA = {
    XS: {
      bust: { cm: "76-83", inch: "30-33" },
      waist: { cm: "58-65", inch: "23-26" },
      hip: { cm: "84-91", inch: "33-36" }
    },
    S: {
      bust: { cm: "84-91", inch: "33-36" },
      waist: { cm: "66-73", inch: "26-29" },
      hip: { cm: "92-99", inch: "36-39" }
    },
    M: {
      bust: { cm: "92-99", inch: "36-39" },
      waist: { cm: "74-81", inch: "29-32" },
      hip: { cm: "100-107", inch: "39-42" }
    },
    L: {
      bust: { cm: "100-107", inch: "39-42" },
      waist: { cm: "82-89", inch: "32-35" },
      hip: { cm: "108-115", inch: "42-45" }
    },
    XL: {
      bust: { cm: "108-115", inch: "42-45" },
      waist: { cm: "90-97", inch: "35-38" },
      hip: { cm: "116-123", inch: "45-48" }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Popup Content */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-medium">Size Guide</h2>
          <div className="flex items-center gap-4">
            {/* Unit Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 rounded-md text-sm transition-all ${
                  unit === 'cm' 
                    ? 'bg-white shadow text-black' 
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                cm
              </button>
              <button
                onClick={() => setUnit('inch')}
                className={`px-3 py-1 rounded-md text-sm transition-all ${
                  unit === 'inch' 
                    ? 'bg-white shadow text-black' 
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                inch
              </button>
            </div>
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        {/* Size Chart */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-4 px-4 bg-gray-50 font-medium">Size</th>
                  {Object.keys(SIZE_DATA).map(size => (
                    <th key={size} className="text-center py-4 px-4 bg-gray-50 font-medium">
                      {size}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['bust', 'waist', 'hip'].map((measurement) => (
                  <tr key={measurement} className="border-t">
                    <td className="py-4 px-4 capitalize">
                      <div className="flex items-center gap-2">
                        <span>{measurement}</span>
                        <Ruler size={16} className="text-gray-400" />
                      </div>
                    </td>
                    {Object.values(SIZE_DATA).map((sizes, index) => (
                      <td key={index} className="py-4 px-4 text-center text-gray-600">
                        {sizes[measurement][unit]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Measurement Guide */}
          <div className="mt-8 bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium mb-4">How to Measure</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <span className="w-16 font-medium">Bust</span>
                <span>Measure around the fullest part of your chest</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-16 font-medium">Waist</span>
                <span>Measure around your natural waistline</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-16 font-medium">Hip</span>
                <span>Measure around the fullest part of your hips</span>
              </p>
            </div>
          </div>
          
          {/* Tips */}
          <div className="mt-4 text-sm text-gray-500">
            <p>• For the most accurate fit, measure yourself in underwear</p>
            <p>• Keep the measuring tape level and comfortably loose</p>
            <p>• If between sizes, size up for a more comfortable fit</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Button Component
const SizeChartButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
      >
        <Ruler size={16} />
        <span>Size Chart</span>
      </button>

      {isOpen && <SizeChartPopup onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default SizeChartButton;