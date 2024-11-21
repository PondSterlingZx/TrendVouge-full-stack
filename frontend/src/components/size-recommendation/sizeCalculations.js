export const calculateRecommendedSize = (userMeasurements, productType, fitPreference) => {
    const template = productMeasurementTemplates[productType];
    if (!template) return null;
  
    const sizeScores = {
      'S': 0,
      'M': 0,
      'L': 0,
      'XL': 0,
      'XXL': 0
    };
  
    // Calculate score for each size
    Object.entries(template.sizeChart).forEach(([size, measurements]) => {
      Object.entries(measurements).forEach(([measurement, range]) => {
        const [min, max] = range.split('-').map(Number);
        const userMeasurement = userMeasurements[measurement];
  
        if (userMeasurement) {
          if (userMeasurement >= min && userMeasurement <= max) {
            sizeScores[size] += 2;
          } else if (userMeasurement >= min - 1 && userMeasurement <= max + 1) {
            sizeScores[size] += 1;
          }
        }
      });
    });
  
    // Adjust for fit preference
    if (fitPreference === 'Tight') {
      sizeScores['S'] += 1;
      sizeScores['M'] += 0.5;
    } else if (fitPreference === 'Loose') {
      sizeScores['L'] += 0.5;
      sizeScores['XL'] += 1;
      sizeScores['XXL'] += 1.5;
    }
  
    // Find size with highest score
    let bestSize = 'M';
    let bestScore = 0;
  
    Object.entries(sizeScores).forEach(([size, score]) => {
      if (score > bestScore) {
        bestSize = size;
        bestScore = score;
      }
    });
  
    return {
      recommendedSize: bestSize,
      confidence: Math.min((bestScore / (template.measurements.length * 2)) * 100, 100),
      alternativeSizes: Object.entries(sizeScores)
        .filter(([size, score]) => score >= bestScore - 1 && size !== bestSize)
        .map(([size]) => size)
    };
  };
  
  export const validateMeasurements = (measurements, productType) => {
    const template = productMeasurementTemplates[productType];
    if (!template) return false;
  
    return template.measurements.every(measurement => {
      const value = measurements[measurement];
      return value && value > 0 && value < 100; // Basic validation
    });
  };