// Size calculation utilities and types
const SizeRanges = {
    XS: {
      bust: { min: 76, max: 83 },
      waist: { min: 58, max: 65 },
      hip: { min: 84, max: 91 },
      height: { min: 150, max: 165 }
    },
    S: {
      bust: { min: 84, max: 91 },
      waist: { min: 66, max: 73 },
      hip: { min: 92, max: 99 },
      height: { min: 155, max: 170 }
    },
    M: {
      bust: { min: 92, max: 99 },
      waist: { min: 74, max: 81 },
      hip: { min: 100, max: 107 },
      height: { min: 160, max: 175 }
    },
    L: {
      bust: { min: 100, max: 107 },
      waist: { min: 82, max: 89 },
      hip: { min: 108, max: 115 },
      height: { min: 165, max: 180 }
    },
    XL: {
      bust: { min: 108, max: 115 },
      waist: { min: 90, max: 97 },
      hip: { min: 116, max: 123 },
      height: { min: 170, max: 185 }
    }
  };
  
  // BMI adjustment factors
  const getBMIAdjustment = (height, weight) => {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    if (bmi < 18.5) return -0.5; // Underweight
    if (bmi > 25) return 0.5; // Overweight
    return 0; // Normal weight
  };
  
  // Fit preference adjustments
  const getFitAdjustment = (preference) => {
    switch (preference) {
      case 'tight': return -0.5;
      case 'loose': return 0.5;
      default: return 0;
    }
  };
  
  const calculateSizeScore = (measurements, targetSize) => {
    const ranges = SizeRanges[targetSize];
    let totalScore = 0;
    let measurementScores = {};
  
    // Calculate score for each measurement
    for (const [key, range] of Object.entries(ranges)) {
      if (measurements[key]) {
        const value = measurements[key];
        const midPoint = (range.max + range.min) / 2;
        const rangeSize = range.max - range.min;
        
        // Calculate how far the measurement is from the ideal midpoint
        const deviation = Math.abs(value - midPoint) / (rangeSize / 2);
        const score = Math.max(0, 1 - deviation);
        
        measurementScores[key] = score;
        totalScore += score;
      }
    }
  
    return {
      totalScore: totalScore / Object.keys(measurementScores).length,
      measurementScores
    };
  };
  
  const analyzeAreaFit = (measurement, targetSize, preference) => {
    const range = SizeRanges[targetSize];
    const value = measurement;
    const midPoint = (range.max + range.min) / 2;
    const rangeSize = range.max - range.min;
    
    const deviation = (value - midPoint) / (rangeSize / 2);
    
    // Adjust based on fit preference
    const adjustedDeviation = deviation + getFitAdjustment(preference);
    
    if (Math.abs(adjustedDeviation) <= 0.2) {
      return { fit: 'perfect', confidence: 95 - Math.abs(adjustedDeviation) * 50 };
    } else if (adjustedDeviation < -0.2) {
      return { fit: 'slightly tight', confidence: 85 - Math.abs(adjustedDeviation) * 30 };
    } else {
      return { fit: 'slightly loose', confidence: 85 - Math.abs(adjustedDeviation) * 30 };
    }
  };
  
  const calculateSize = (basicInfo, bodyMeasurements, fitPreference) => {
    // Normalize measurements to cm
    const measurements = {
      bust: bodyMeasurements.bust,
      waist: bodyMeasurements.waist,
      hip: bodyMeasurements.hip,
      height: parseInt(basicInfo.height)
    };
  
    // Calculate base scores for each size
    const sizeScores = {};
    for (const size of Object.keys(SizeRanges)) {
      sizeScores[size] = calculateSizeScore(measurements, size);
    }
  
    // Apply BMI adjustment
    const bmiAdjustment = getBMIAdjustment(basicInfo.height, basicInfo.weight);
    
    // Apply fit preference adjustment
    const fitAdjustment = getFitAdjustment(fitPreference.general);
    
    // Calculate final scores with adjustments
    const adjustedScores = {};
    for (const [size, score] of Object.entries(sizeScores)) {
      const sizeIndex = Object.keys(SizeRanges).indexOf(size);
      adjustedScores[size] = score.totalScore - 
        Math.abs(sizeIndex / Object.keys(SizeRanges).length + bmiAdjustment + fitAdjustment);
    }
  
    // Find best size
    const recommendedSize = Object.entries(adjustedScores)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0];
  
    // Analyze fit for each area
    const fitAnalysis = {
      shoulders: analyzeAreaFit(measurements.bust * 0.9, recommendedSize, 
        fitPreference.areas.shoulders || fitPreference.general),
      bust: analyzeAreaFit(measurements.bust, recommendedSize,
        fitPreference.areas.chest || fitPreference.general),
      waist: analyzeAreaFit(measurements.waist, recommendedSize,
        fitPreference.areas.waist || fitPreference.general),
      hips: analyzeAreaFit(measurements.hip, recommendedSize,
        fitPreference.areas.hips || fitPreference.general)
    };
  
    // Find alternative sizes
    const sortedSizes = Object.entries(adjustedScores)
      .sort((a, b) => b[1] - a[1])
      .map(([size]) => size);
    
    const alternativeSizes = sortedSizes
      .slice(1, 3)
      .filter(size => adjustedScores[size] > 0.6);
  
    return {
      recommendedSize,
      fitAnalysis,
      alternativeSizes,
      measurements: {
        bust: measurements.bust,
        waist: measurements.waist,
        hips: measurements.hip,
        height: measurements.height
      },
      confidence: Math.round(adjustedScores[recommendedSize] * 100)
    };
  };
  
  export { calculateSize };