import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductCustomNavigate = ({id, image, name, price}) => {
    const {currency} = useContext(ShopContext);

    // Add console.log to debug
    console.log('ProductCustomNavigate props:', { id, image, name, price });

    return (
        <Link 
            onClick={() => {
                scrollTo(0,0);
                console.log('Navigating to product:', id);
            }} 
            className='text-gray-700 cursor-pointer' 
            to={`/product-customize/${id}`}
        >
            <div className='overflow-hidden'>
                <img 
                    className='hover:scale-110 transition ease-in-out' 
                    src={image?.[0]} 
                    alt={name} 
                />
            </div>
            <p className='pt-3 pb-1 text-sm'>{name}</p>
            <p className='text-sm font-medium'>{currency}{price}</p>
        </Link>
    )
}

export default ProductCustomNavigate