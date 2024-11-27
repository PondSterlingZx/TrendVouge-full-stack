import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import Draggable from 'react-draggable'
import { ResizableBox } from 'react-resizable'
import { toast } from 'react-toastify'
import 'react-resizable/css/styles.css'

const Matching = () => {
  const { products, search, showSearch, token, addToCart } = useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(false)
  const [filterProducts, setFilterProducts] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortType, setSortType] = useState('relevant')
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [quantity, setQuantity] = useState(1);
  
  // Matching specific states
  const [selectedItems, setSelectedItems] = useState([])
  const [outfitPreview, setOutfitPreview] = useState({
    Topwear: { item: null, size: '' },
    Bottomwear: { item: null, size: '' },
    Winterwear: { item: null, size: '' }
  })

  // Drag and resize states
  const [positions, setPositions] = useState({})
  const [itemSizes, setItemSizes] = useState({})

 

  const handleDrag = (itemId, data) => {
    setPositions(prev => ({
      ...prev,
      [itemId]: { x: data.x, y: data.y }
    }))
  }

  const handleResize = (itemId, size) => {
    setItemSizes(prev => ({
      ...prev,
      [itemId]: size
    }))
  }

  const handleSizeSelect = (type, size) => {
    setOutfitPreview(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        size
      }
    }))
  }

  const handleItemSelect = (item) => {
    const isSelected = selectedItems.find(selected => selected._id === item._id)
    
    if (isSelected) {
      setSelectedItems(prev => prev.filter(i => i._id !== item._id))
      setOutfitPreview(prev => ({
        ...prev,
        [item.subCategory]: { item: null, size: '' }
      }))
      setPositions(prev => {
        const newPositions = { ...prev }
        delete newPositions[item._id]
        return newPositions
      })
      setItemSizes(prev => {
        const newSizes = { ...prev }
        delete newSizes[item._id]
        return newSizes
      })
    } else {
      const existingCategoryItem = selectedItems.find(i => i.subCategory === item.subCategory)
      
      if (existingCategoryItem) {
        setSelectedItems(prev => [
          ...prev.filter(i => i._id !== existingCategoryItem._id),
          item
        ])
        setPositions(prev => {
          const newPositions = { ...prev }
          delete newPositions[existingCategoryItem._id]
          return newPositions
        })
        setItemSizes(prev => {
          const newSizes = { ...prev }
          delete newSizes[existingCategoryItem._id]
          return newSizes
        })
        setOutfitPreview(prev => ({
          ...prev,
          [item.subCategory]: { item, size: '' }
        }))
      } else if (selectedItems.length < 3) {
        setSelectedItems(prev => [...prev, item])
        setOutfitPreview(prev => ({
          ...prev,
          [item.subCategory]: { item, size: '' }
        }))
      }
    }
  }

  const handleAddToCart = async () => {
    if (!token) {
      toast.warning("Please sign in to add items to cart");
      return;
    }
  
    const missingSize = Object.entries(outfitPreview)
      .filter(([_, data]) => data.item)
      .find(([_, data]) => !data.size);
  
    if (missingSize) {
      toast.warning(`Please select a size for ${missingSize[0]}`);
      return;
    }
  
    try {
      setIsAddingToCart(true);
      
      for (const [_, data] of Object.entries(outfitPreview)) {
        if (data.item && data.size) {
          await addToCart(data.item._id, data.size, 1); // Set suppressToast to false
        }
      }
  
      toast.success("Added to cart successfully!");
  
      // Reset states
      setSelectedItems([]);
      setOutfitPreview({
        Topwear: { item: null, size: '' },
        Bottomwear: { item: null, size: '' },
        Winterwear: { item: null, size: '' }
      });
      setPositions({});
      setItemSizes({});
      
    } catch (error) {
      toast.error("Failed to add outfit to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Your existing filter functions and effects...
  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setSubCategory(prev => [...prev, e.target.value])
    }
  }

  const applyFilter = () => {
    let productsCopy = products.slice()

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category))
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
    }

    setFilterProducts(productsCopy)
  }

  useEffect(() => {
    applyFilter()
  }, [category, subCategory, search, showSearch, products])

  useEffect(() => {
    let fpCopy = filterProducts.slice()
    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a,b) => (a.price - b.price)))
        break
      case 'high-low':
        setFilterProducts(fpCopy.sort((a,b) => (b.price - a.price)))
        break
      default:
        applyFilter()
    }
  }, [sortType])
  
  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* Left Side: Filters */}
      <div className='lg:w-[500px] w-full'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>
          FILTERS
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
        </p>
        
        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Men'} onChange={toggleCategory}/> Men
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Women'} onChange={toggleCategory}/> Women
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Kids'} onChange={toggleCategory}/> kids
            </p>
          </div>
        </div>

        {/* SubCategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Topwear'} onChange={toggleSubCategory}/> Topwear
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Bottomwear'} onChange={toggleSubCategory}/> Bottomwear
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Winterwear'} onChange={toggleSubCategory}/> Winterwear
            </p>
          </div>
        </div>

        {/* Outfit Preview */}
        <div className='border border-gray-300 p-5 my-5'>
          <h3 className='text-lg font-medium mb-4'>Outfit Preview</h3>
          
          {/* Preview Area */}
          <div className='relative w-full h-[500px] bg-white rounded-lg overflow-hidden mb-4'>           
            {selectedItems.map((item, index) => (
              <Draggable
                key={item._id}
                defaultPosition={{x: 0, y: 0}}
                position={positions[item._id]}
                onDrag={(e, data) => handleDrag(item._id, data)}
                bounds="parent"
              >
                <div 
                  className="absolute cursor-move" 
                  style={{ 
                    zIndex: index + 1,
                    width: itemSizes[item._id]?.width || 300,
                    height: itemSizes[item._id]?.height || 300
                  }}
                >
                  <ResizableBox
                    width={itemSizes[item._id]?.width || 300}
                    height={itemSizes[item._id]?.height || 300}
                    onResize={(e, { size }) => handleResize(item._id, size)}
                    minConstraints={[50, 50]}
                    maxConstraints={[300, 300]}
                    resizeHandles={['se']}
                  >
                    <img
                      src={item.image[0]}
                      alt={item.name}
                      className="w-full h-full object-contain"
                      style={{
                        userSelect: 'none',
                        WebkitUserSelect: 'none'
                      }}
                    />
                  </ResizableBox>
                </div>
              </Draggable>
            ))}
          </div>

          {/* Selected Items List with Size Selection */}
          <div className='space-y-2'>
            {['Topwear', 'Bottomwear', 'Winterwear'].map((type) => (
              <div key={type} className='p-4 bg-gray-50 rounded'>
                <div className='flex flex-col gap-2'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm'>{type}</span>
                    {outfitPreview[type].item ? (
                      <div className='flex items-center gap-2'>
                        <span className='text-xs truncate'>{outfitPreview[type].item.name}</span>
                        <button
                          onClick={() => handleItemSelect(outfitPreview[type].item)}
                          className='text-red-500 text-xs hover:text-red-700'
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <span className='text-xs text-gray-400'>Not selected</span>
                    )}
                  </div>

                  {outfitPreview[type].item && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-2">Select Size:</p>
                      <div className="flex flex-wrap gap-2">
                        {outfitPreview[type].item.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSizeSelect(type, size)}
                            className={`px-2 py-1 text-xs border rounded transition-colors
                              ${outfitPreview[type].size === size 
                                ? 'border-orange-500 bg-orange-50 text-orange-700' 
                                : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}
                          >
                            {size}
                          </button>
                          
                        ))}
                        
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Total Price */}
          <div className='mt-4 pt-4 border-t'>
            <div className='flex justify-between text-sm mb-4'>
              <span>Total Price</span>
              <span className='font-medium'>
                ${selectedItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
              </span>
            </div>
            
            <button
              onClick={handleAddToCart}
              className='w-full py-2 bg-black text-white text-sm rounded
                hover:bg-gray-800 transition-colors duration-200
                disabled:bg-gray-300 disabled:cursor-not-allowed'
              disabled={selectedItems.length === 0 || isAddingToCart || !token}
            >
              {!token ? 'Sign in to Add to Cart' : 
               isAddingToCart ? 'Adding to Cart...' :
               selectedItems.length === 0 ? 'Select Items' :
               'Add Outfit to Cart'}
            </button>
          </div>
        </div>
      </div>

      {/* Right Side: Products */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'CREATE'} text2={'OUTFIT'} />
          <select 
            onChange={(e) => setSortType(e.target.value)} 
            className='border-2 border-gray-300 text-sm px-2'
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className='grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3 gap-y-5'>
          {filterProducts.map((item) => (
            <div
              key={item._id}
              onClick={() => handleItemSelect(item)}
              className={`
                relative cursor-pointer transition-all duration-500
                ${selectedItems.find(selected => selected._id === item._id) 
                  ? 'ring-2 ring-blue-500 shadow-lg' 
                  : 'hover:shadow-md'}
              `}
            >
              <div className='aspect-square overflow-hidden'>
                <img 
                  src={item.image[0]} 
                  alt={item.name}
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='p-3 bg-white'>
                <h3 className='text-sm font-medium truncate'>{item.name}</h3>
                <div className='flex justify-between items-center mt-1'>
                  <span className='text-sm text-gray-500'>${item.price}</span>
                  <span className='text-xs px-2 py-1 bg-gray-100 rounded'>
                    {item.subCategory}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Styles for drag and resize */}
      <style jsx global>{`
        .react-draggable {
          position: absolute !important;
        }
        
        .react-resizable {
          position: relative;
        }

        .react-resizable-handle {
          position: absolute;
          width: 10px;
          height: 10px;
          background-color: #3b82f6;
          border-radius: 50%;
          bottom: -5px;
          right: -5px;
          cursor: se-resize;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .react-resizable:hover .react-resizable-handle {
          opacity: 0.8;
        }

        .react-draggable img {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

export default Matching;