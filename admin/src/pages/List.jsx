import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { FaTrash, FaEdit, FaSearch } from 'react-icons/fa'
import EditProductModal from '../components/EditProductModal'

const List = ({ token }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
  const [editingProduct, setEditingProduct] = useState(null)

  const fetchList = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${backendUrl}/api/product/list`)
      if (response.data.success) {
        setList(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const removeProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await axios.post(`${backendUrl}/api/product/remove`, { id }, { headers: { token } })
        if (response.data.success) {
          toast.success(response.data.message)
          setList(list.filter(item => item._id !== id))
        } else {
          toast.error(response.data.message)
        }
      } catch (error) {
        console.error(error)
        toast.error('Failed to remove product')
      }
    }
  }

  const editProduct = (product) => {
    setEditingProduct(product)
  }

  const handleUpdateProduct = (updatedProduct) => {
    setList(list.map(item => item._id === updatedProduct._id ? updatedProduct : item))
  }

  const handleSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const sortedList = React.useMemo(() => {
    let sortableItems = [...list]
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return sortableItems
  }, [list, sortConfig])

  const filteredList = sortedList.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">All Products List</h2>
      <div className="mb-4 flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 border rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <button
          onClick={fetchList}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh List
        </button>
      </div>
      {loading ? (
        <p className="text-center">Loading products...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('image')}>Image</th>
                <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('name')}>Name</th>
                <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('category')}>Category</th>
                <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('price')}>Price</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <img className="w-16 h-16 object-cover" src={item.image[0]} alt={item.name} />
                  </td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.category}</td>
                  <td className="px-4 py-2">{currency}{item.price.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => editProduct(item)}
                      className="mr-2 text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => removeProduct(item._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && filteredList.length === 0 && (
        <p className="text-center mt-4">No products found.</p>
      )}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdate={handleUpdateProduct}
          token={token}
        />
      )}
    </div>
  )
}

export default List