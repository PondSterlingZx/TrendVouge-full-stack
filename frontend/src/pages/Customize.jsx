import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductCustomNavigate from '../components/ProductCustomNavigate';

const Customize = () => {
  const { products } = useContext(ShopContext);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    console.log('All products:', products);
    if (products && products.length > 0) {
      // Make sure products have the customize property
      const customizableProducts = products.filter(product => product.customize === true);
      console.log('Filtered customizable products:', customizableProducts);
      setFilteredProducts(customizableProducts);
    }
  }, [products]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Customizable Products</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          console.log('Rendering product:', product);
          return (
            <ProductCustomNavigate
              key={product._id}
              id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
            />
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No customizable products found</p>
          <p className="text-sm text-gray-400 mt-2">Total products: {products?.length || 0}</p>
        </div>
      )}
    </div>
  );
};

export default Customize;