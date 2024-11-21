import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = ({ isOpen }) => {
    const location = useLocation();

    const menuItems = [
        {
            path: "/add",
            icon: assets.add_icon,
            label: "Add Items"
        },
        {
            path: "/list",
            icon: assets.order_icon,
            label: "List Items"
        },
        {
            path: "/orders",
            icon: assets.order_icon,
            label: "Orders"
        }
    ];

    return (
        <aside className={`
            fixed left-0 top-16 h-[calc(100vh-64px)] bg-white shadow-lg
            transition-all duration-300 ease-in-out z-10
            ${isOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'}
        `}>
            <div className='flex flex-col gap-2 p-4'>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-lg
                            transition-all duration-200
                            ${isActive 
                                ? 'bg-black text-white' 
                                : 'text-gray-600 hover:bg-gray-100'
                            }
                        `}
                    >
                        <div className="flex items-center justify-center w-6 h-6">
                            <img 
                                className={`w-5 h-5 ${location.pathname === item.path ? 'filter invert' : ''}`}
                                src={item.icon} 
                                alt={item.label} 
                            />
                        </div>
                        <span className={`
                            whitespace-nowrap transition-all duration-200
                            ${isOpen ? 'opacity-100' : 'opacity-0 md:opacity-100'}
                        `}>
                            {item.label}
                        </span>
                    </NavLink>
                ))}
            </div>

            {/* Mobile overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
                    onClick={() => onClose?.()}
                />
            )}
        </aside>
    )
}

export default Sidebar

