import React, { useState } from 'react';
import { ArrowLeft, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Body3DVisualizer from './3D/BodyModel.jsx';

const SizeQuizModal = ({ productData, onClose, onSizeSelected }) => {
  const [step, setStep] = useState(0);
  
  // Replace basicInfo with userMeasurements
  const [userMeasurements, setUserMeasurements] = useState({
    height: '',
    weight: '',
    age: '',
    bust: 85,
    waist: 70,
    hip: 95
  });

  const [fitPreference, setFitPreference] = useState({
    general: 'regular',
    areas: {
      shoulders: 'regular',
      chest: 'regular',
      waist: 'regular',
      hips: 'regular'
    }
  });

  const [result, setResult] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showGuidance, setShowGuidance] = useState(null);

  const isStepComplete = () => {
    switch(step) {
      case 0: // Updated validation for basic info
        return userMeasurements.height && 
               userMeasurements.weight && 
               userMeasurements.age;
      case 1:
        return Object.entries(userMeasurements)
          .filter(([key]) => ['bust', 'waist', 'hip'].includes(key))
          .every(([_, value]) => value >= 40 && value <= 140);
      case 2:
        return fitPreference.general && 
               Object.values(fitPreference.areas).every(Boolean);
      default:
        return true;
    }
  };

  const steps = [
    {
      title: "Basic Information",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Height (cm)</label>
              <input
                type="number"
                value={userMeasurements.height}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value >= 120 && value <= 220) {
                    setUserMeasurements(prev => ({
                      ...prev,
                      height: value
                    }));
                  }
                }}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="170"
                min="120"
                max="220"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Weight (kg)</label>
              <input
                type="number"
                value={userMeasurements.weight}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value >= 30 && value <= 200) {
                    setUserMeasurements(prev => ({
                      ...prev,
                      weight: value
                    }));
                  }
                }}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="60"
                min="30"
                max="200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Age</label>
              <input
                type="number"
                value={userMeasurements.age}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value >= 13 && value <= 100) {
                    setUserMeasurements(prev => ({
                      ...prev,
                      age: value
                    }));
                  }
                }}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="25"
                min="13"
                max="100"
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              This information helps us provide more accurate size recommendations.
              All data is private and only used for size calculations.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Adjust Body Shape",
      content: (
        <div className="flex gap-8">
          {/* Body Visualization */}
          <div className="w-1/2 bg-gray-50 rounded-lg aspect-[3/4] relative">
            {/* Measurement lines */}
            <div className="absolute inset-0">
              <div 
                className="absolute left-0 right-0 h-0.5 bg-green-400"
                style={{ 
                  top: `${30 + (bodyShape.bust * 0.2)}%`,
                  width: `${50 + bodyShape.bust * 0.5}%`,
                  left: `${25 - bodyShape.bust * 0.25}%`
                }}
              >
                <span className="absolute -left-16 top-1/2 -translate-y-1/2 text-xs">
                  {bodyShape.bust}cm
                </span>
              </div>
              <div 
                className="absolute left-0 right-0 h-0.5 bg-green-400"
                style={{ 
                  top: `${50 + (bodyShape.waist * 0.2)}%`,
                  width: `${40 + bodyShape.waist * 0.5}%`,
                  left: `${30 - bodyShape.waist * 0.25}%`
                }}
              >
                <span className="absolute -left-16 top-1/2 -translate-y-1/2 text-xs">
                  {bodyShape.waist}cm
                </span>
              </div>
              <div 
                className="absolute left-0 right-0 h-0.5 bg-green-400"
                style={{ 
                  top: `${70 + (bodyShape.hip * 0.2)}%`,
                  width: `${45 + bodyShape.hip * 0.5}%`,
                  left: `${27.5 - bodyShape.hip * 0.25}%`
                }}
              >
                <span className="absolute -left-16 top-1/2 -translate-y-1/2 text-xs">
                  {bodyShape.hip}cm
                </span>
              </div>
            </div>
          </div>

          {/* Measurement Controls */}
          <div className="w-1/2 space-y-6">
            <p className="text-sm text-gray-600">
              Adjust the measurements to match your body shape
            </p>

            {Object.entries(bodyShape).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium capitalize">
                    {key}
                  </label>
                  <span className="text-sm text-gray-500">
                    {value}cm
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => setBodyShape(prev => ({
                    ...prev,
                    [key]: Number(e.target.value)
                  }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Fit Preference",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {['Tight', 'Regular', 'Loose'].map((fit) => (
              <button
                key={fit}
                onClick={() => setFitPreference(fit.toLowerCase())}
                className={`
                  p-4 border rounded-lg text-center transition-all
                  ${fitPreference === fit.toLowerCase() 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                  }
                `}
              >
                <div className="font-medium">{fit}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {fit === 'Tight' && 'Close to body'}
                  {fit === 'Regular' && 'Standard fit'}
                  {fit === 'Loose' && 'Relaxed fit'}
                </div>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Size Recommendation",
      content: (
        <div className="flex gap-8">
          {/* Product Image */}
          <div className="w-1/3">
            <img 
              src={productData.image[0]} 
              alt={productData.name} 
              className="w-full rounded-lg"
            />
            <div className="mt-4 text-center">
              <h3 className="font-medium">{productData.name}</h3>
            </div>
          </div>

          {/* Size Recommendation */}
          <div className="w-2/3">
            <div className="text-center mb-8">
              <p className="text-sm text-gray-500 mb-1">Recommended Size</p>
              <div className="text-5xl font-bold text-blue-600">M</div>
            </div>

            {/* Fit Analysis */}
            <div className="space-y-4">
              {['Bust', 'Waist', 'Hip'].map((area) => (
                <div key={area} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{area}</span>
                    <span className="text-gray-500">Slightly loose</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-green-500 rounded-full" />
                  </div>
                </div>
              ))}
            </div>

            {/* Alternative Sizes */}
            <div className="mt-8">
              <p className="text-sm text-gray-600 mb-2">Also consider these sizes:</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">S</button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">L</button>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-4xl rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-4">
            {step > 0 && (
              <button
                onClick={() => setStep(prev => prev - 1)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ←
              </button>
            )}
            <h2 className="text-xl font-medium">{steps[step].title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {steps[step].content}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`
                    w-2 h-2 rounded-full transition-all
                    ${index === step ? 'bg-blue-600' : 'bg-gray-200'}
                  `}
                />
              ))}
            </div>

            <button
              onClick={() => {
                if (step === steps.length - 1) {
                  onSizeSelected('M'); // Replace with actual calculation
                  onClose();
                } else {
                  setStep(prev => prev + 1);
                }
              }}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              {step === steps.length - 1 ? 'Select Size' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeRecommendationModal;