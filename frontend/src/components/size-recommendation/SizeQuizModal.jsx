import React, { useState, useEffect } from "react";
import { ArrowLeft, Info, X, Ruler } from "lucide-react";
import Body3DVisualizer from "./3D/BodyModel.jsx";

const MEASUREMENT_GUIDANCE = {
  bust: "Measure around the fullest part of your bust while wearing a non-padded bra",
  waist: "Measure around your natural waistline, at the narrowest part of your torso",
  hip: "Measure around the fullest part of your hips"
};

const SIZE_RANGES = {
  XS: {
    bust: { min: 76, max: 83 },
    waist: { min: 58, max: 65 },
    hip: { min: 84, max: 91 }
  },
  S: {
    bust: { min: 84, max: 91 },
    waist: { min: 66, max: 73 },
    hip: { min: 92, max: 99 }
  },
  M: {
    bust: { min: 92, max: 99 },
    waist: { min: 74, max: 81 },
    hip: { min: 100, max: 107 }
  },
  L: {
    bust: { min: 100, max: 107 },
    waist: { min: 82, max: 89 },
    hip: { min: 108, max: 115 }
  },
  XL: {
    bust: { min: 108, max: 115 },
    waist: { min: 90, max: 97 },
    hip: { min: 116, max: 123 }
  }
};

const SizeQuizModal = ({ productData, onClose, onSizeSelected }) => {
  // Basic states
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showGuidance, setShowGuidance] = useState(null);

  // User data states
  const [basicInfo, setBasicInfo] = useState({
    height: "",
    weight: "",
    age: "",
    gender: ""
  });

  // Body measurement states
  const [bodyMeasurements, setBodyMeasurements] = useState({
    bust: 90,
    waist: 75,
    hip: 95
  });

  // Fit preference states
  const [fitPreference, setFitPreference] = useState({
    general: "regular",
    areas: {
      shoulders: "regular",
      chest: "regular",
      waist: "regular",
      hips: "regular"
    }
  });

  // Result states
  const [result, setResult] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const calculateSize = () => {
    setLoading(true);
    let bestMatch = null;
    let bestScore = -Infinity;
  
    // Sort sizes from smallest to largest
    const sizeOrder = ["XS", "S", "M", "L", "XL"];
    
    for (const size of sizeOrder) {
      const ranges = SIZE_RANGES[size];
      let score = 0;
      let totalMeasurements = 0;
  
      for (const [measure, range] of Object.entries(ranges)) {
        if (bodyMeasurements[measure]) {
          const value = bodyMeasurements[measure];
          const midPoint = (range.min + range.max) / 2;
          
          // Calculate base score
          if (value >= range.min && value <= range.max) {
            score += 1;
          } else {
            const rangeSize = range.max - range.min;
            const distance = Math.abs(value - midPoint) / rangeSize;
            score += Math.max(0, 1 - distance);
          }
  
          // Add size progression penalty for values exceeding ranges
          if (value > range.max) {
            // If current size is not XL and measurement exceeds range
            if (size !== "XL") {
              score -= 0.5; // Penalize this size more
            }
          } else if (value < range.min) {
            // If current size is not XS and measurement is below range
            if (size !== "XS") {
              score -= 0.5; // Penalize this size more
            }
          }
          
          totalMeasurements++;
        }
      }
  
      const averageScore = score / totalMeasurements;
      let adjustedScore = averageScore;
  
      // Adjust score based on fit preference
      if (fitPreference.general === "tight") {
        adjustedScore += sizeOrder.indexOf(size) * -0.1; // Favor smaller sizes
      } else if (fitPreference.general === "loose") {
        adjustedScore += (sizeOrder.length - 1 - sizeOrder.indexOf(size)) * -0.1; // Favor larger sizes
      }
  
      if (adjustedScore > bestScore) {
        bestScore = adjustedScore;
        bestMatch = size;
      }
    }

    const fitAnalysis = {};
    const ranges = SIZE_RANGES[bestMatch];
    
    for (const [measure, range] of Object.entries(ranges)) {
      const value = bodyMeasurements[measure];
      
      let fit;
      let confidence;
      
      if (value >= range.min && value <= range.max) {
        fit = "perfect";
        confidence = 95;
      } else if (value < range.min) {
        fit = "slightly tight";
        confidence = Math.round(85 * (value / range.min));
      } else {
        fit = "slightly loose";
        confidence = Math.round(85 * (range.max / value));
      }
      
      fitAnalysis[measure] = { fit, confidence };
    }

    const currentIndex = sizeOrder.indexOf(bestMatch);
    const alternativeSizes = [];
    
    if (currentIndex > 0) alternativeSizes.push(sizeOrder[currentIndex - 1]);
    if (currentIndex < sizeOrder.length - 1) alternativeSizes.push(sizeOrder[currentIndex + 1]);

    setTimeout(() => {
      setResult({
        recommendedSize: bestMatch,
        fitAnalysis,
        alternativeSizes,
        measurements: bodyMeasurements,
        confidence: Math.round(bestScore * 100)
      });
      setLoading(false);
    }, 1000);
  };

  const isStepComplete = () => {
    switch(step) {
      case 0:
        return basicInfo.height && basicInfo.weight;
      case 1:
        return Object.values(bodyMeasurements).every(v => v >= 60 && v <= 130);
      case 2:
        return fitPreference.general;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (step === 2) {
      calculateSize();
    }
    setStep(prev => prev + 1);
  };

  const steps = [
    {
      title: "Basic Information",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Height (cm)</label>
              <input
                type="text" // Changed from number to text
                value={basicInfo.height}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow empty input or numbers only
                  if (value === '' || (/^\d*\.?\d*$/.test(value) && value.length <= 6)) {
                    const numValue = parseFloat(value);
                    if (value === '' || (!isNaN(numValue) && numValue >= 0 && numValue <= 220)) {
                      setBasicInfo(prev => ({
                        ...prev,
                        height: value
                      }));
                    }
                  }
                }}
                onBlur={(e) => {
                  const value = parseFloat(e.target.value);
                  if (isNaN(value) || value < 120 || value > 220) {
                    setBasicInfo(prev => ({
                      ...prev,
                      height: ''
                    }));
                  }
                }}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="170"
              />
              <p className="text-xs text-gray-500 mt-1">Valid range: 120-220 cm</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Weight (kg)</label>
              <input
                type="text" // Changed from number to text
                value={basicInfo.weight}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow empty input or numbers only
                  if (value === '' || (/^\d*\.?\d*$/.test(value) && value.length <= 5)) {
                    const numValue = parseFloat(value);
                    if (value === '' || (!isNaN(numValue) && numValue >= 0 && numValue <= 200)) {
                      setBasicInfo(prev => ({
                        ...prev,
                        weight: value
                      }));
                    }
                  }
                }}
                onBlur={(e) => {
                  const value = parseFloat(e.target.value);
                  if (isNaN(value) || value < 30 || value > 200) {
                    setBasicInfo(prev => ({
                      ...prev,
                      weight: ''
                    }));
                  }
                }}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="60"
              />
              <p className="text-xs text-gray-500 mt-1">Valid range: 30-200 kg</p>
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
      title: "Body Shape",
      subtitle: "Adjust the measurements to match your body shape",
      content: (
        <div className="flex gap-8">
          <div className="w-1/2 h-[500px] relative">
            <Body3DVisualizer
              measurements={bodyMeasurements}
              className="w-full h-full bg-gray-50 rounded-lg"
            />
          </div>

          <div className="w-1/2 space-y-6">
            {Object.entries(bodyMeasurements).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium capitalize">
                      {key}
                    </label>
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => setShowGuidance(key)}
                    >
                      <Info size={16} />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {value}cm
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setBodyMeasurements(prev => ({
                      ...prev,
                      [key]: Math.max(60, prev[key] - 1)
                    }))}
                    className="w-8 h-8 flex items-center justify-center border rounded-md"
                  >
                    -
                  </button>
                  
                  <input
                    type="range"
                    min="60"
                    max="130"
                    value={value}
                    onChange={(e) => setBodyMeasurements(prev => ({
                      ...prev,
                      [key]: Number(e.target.value)
                    }))}
                    className="flex-1"
                  />
                  
                  <button
                    onClick={() => setBodyMeasurements(prev => ({
                      ...prev,
                      [key]: Math.min(130, prev[key] + 1)
                    }))}
                    className="w-8 h-8 flex items-center justify-center border rounded-md"
                  >
                    +
                  </button>
                </div>
                
                {showGuidance === key && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg transition-all duration-200 opacity-100">
                    {MEASUREMENT_GUIDANCE[key]}
                  </div>
                )}
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
          <div>
            <h3 className="font-medium mb-4">How do you prefer your clothes to fit?</h3>
            <div className="grid grid-cols-3 gap-4">
              {["Tight", "Regular", "Loose"].map((fit) => (
                <button
                  key={fit}
                  onClick={() => setFitPreference(prev => ({
                    ...prev,
                    general: fit.toLowerCase()
                  }))}
                  className={`
                    p-4 border rounded-lg text-center transition-all duration-200
                    ${fitPreference.general === fit.toLowerCase() 
                      ? "border-blue-500 bg-blue-50" 
                      : "hover:bg-gray-50"
                    }
                  `}
                >
                  <div className="font-medium">{fit}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {fit === "Tight" && "Close to body fit"}
                    {fit === "Regular" && "Standard comfortable fit"}
                    {fit === "Loose" && "Relaxed roomy fit"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Any specific fit preferences?</h3>
            <div className="space-y-2">
              {[
                { id: "shoulders", label: "Shoulders" },
                { id: "chest", label: "Chest/Bust" },
                { id: "waist", label: "Waist" },
                { id: "hips", label: "Hips" }
              ].map((area) => (
                <div key={area.id} className="flex items-center gap-4">
                  <span className="w-24">{area.label}</span>
                  <div className="flex-1 flex gap-2">
                    {["tight", "regular", "loose"].map((fit) => (
                      <button
                        key={fit}
                        onClick={() => setFitPreference(prev => ({
                          ...prev,
                          areas: {
                            ...prev.areas,
                            [area.id]: fit
                          }
                        }))}
                        className={`
                          flex-1 py-2 border rounded transition-all duration-200
                          ${fitPreference.areas[area.id] === fit 
                            ? "border-blue-500 bg-blue-50" 
                            : "hover:bg-gray-50"
                          }
                        `}
                      >
                        {fit.charAt(0).toUpperCase() + fit.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Size Recommendation",
      content: result ? (
        <div className="flex gap-8">
          <div className="w-1/3">
            <img 
              src={productData.image} 
              alt={productData.name}
              className="w-full rounded-lg"
            />
            <div className="mt-4 text-center">
              <h3 className="font-medium">{productData.name}</h3>
              <p className="text-sm text-gray-500">{productData.category}</p>
            </div>
          </div>

          <div className="w-2/3">
            <div className="text-center mb-8">
              <div className="text-5xl font-bold">{result.recommendedSize}</div>
              <div className="text-sm text-green-600 mt-1">BEST OPTION</div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                {Object.entries(result.fitAnalysis).map(([area, analysis]) => (
                  <div key={area} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium capitalize">{area}</span>
                      <span className="text-gray-500">{analysis.fit}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`
                          h-full rounded-full transition-all duration-200
                          ${analysis.fit === "perfect" ? "bg-green-500" : ""}
                          ${analysis.fit === "slightly tight" ? "bg-orange-500" : ""}
                          ${analysis.fit === "slightly loose" ? "bg-blue-500" : ""}
                        `}
                        style={{ width: `${analysis.confidence}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {result.alternativeSizes?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Also try these sizes:</h4>
                  <div className="flex gap-2">
                    {result.alternativeSizes.map(size => (
                      <button
                        key={size}
                        onClick={() => onSizeSelected(size)}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-all duration-200"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {showDetails && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Detailed Measurements</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(result.measurements).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600 capitalize">{key}</span>
                        <span>{value}cm</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-blue-600 text-sm hover:underline transition-all duration-200"
              >
                {showDetails ? "Hide details" : "Show detailed measurements"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-500">Calculating your perfect size...</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-4">
            {step > 0 && (
              <button
                onClick={() => {
                  setStep(prev => prev - 1);
                  if (step === 3) {
                    setResult(null);
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h2 className="text-xl font-medium">{steps[step].title}</h2>
              {steps[step].subtitle && (
                <p className="text-sm text-gray-500">{steps[step].subtitle}</p>
              )}
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 140px)" }}>
          <div className="transition-all duration-300 ease-in-out">
            {steps[step].content}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t">
          <div className="flex justify-between items-center">
            {/* Progress indicators */}
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-200
                    ${index === step ? "bg-blue-600" : "bg-gray-200"}
                  `}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <button
              onClick={() => {
                if (step < steps.length - 1) {
                  handleNextStep();
                } else {
                  onSizeSelected(result.recommendedSize);
                  onClose();
                }
              }}
              disabled={!isStepComplete()}
              className={`
                px-6 py-2 rounded-lg transition-all duration-200
                ${isStepComplete()
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"}
              `}
            >
              {step === steps.length - 1 ? "Select Size" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeQuizModal;