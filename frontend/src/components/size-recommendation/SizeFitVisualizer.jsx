const SizeFitVisualizer = ({ size, measurements, productMeasurements }) => {
    const getFitStatus = (measurement) => {
      const diff = measurements[measurement] - productMeasurements[measurement];
      if (Math.abs(diff) < 2) return 'perfect';
      if (diff > 0) return 'tight';
      return 'loose';
    };
  
    return (
      <div className="flex gap-8">
        <div className="w-1/3">
          <div className="aspect-square bg-gray-50 rounded-lg p-4">
            {/* Product Image */}
            <img src={productImage} alt="Product" className="w-full h-full object-contain" />
          </div>
        </div>
  
        <div className="w-2/3">
          <div className="mb-6">
            <h3 className="text-2xl font-bold">Size {size}</h3>
            <p className="text-sm text-gray-500">Best option based on your measurements</p>
          </div>
  
          <div className="space-y-4">
            {Object.entries(measurements).map(([key, value]) => (
              <div key={key} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium">{key}</div>
                <div className="flex-1 relative h-1 bg-gray-100 rounded">
                  <div 
                    className={`
                      absolute h-full rounded
                      ${getFitStatus(key) === 'perfect' ? 'bg-green-400' : ''}
                      ${getFitStatus(key) === 'tight' ? 'bg-orange-400' : ''}
                      ${getFitStatus(key) === 'loose' ? 'bg-blue-400' : ''}
                    `}
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="w-20 text-sm text-gray-500">
                  {getFitStatus(key)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };