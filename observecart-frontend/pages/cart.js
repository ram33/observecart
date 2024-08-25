import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getCart, updateCartItem, removeCartItem, getProducts } from '../api'
import { useAuth } from '../contexts/AuthContext'

export default function Cart() {
  const [cart, setCart] = useState({})
  const [products, setProducts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (authLoading) return; // Don't do anything while auth is loading

    if (user) {
      fetchCart()
      fetchProducts()
    } else {
      router.push('/login')
    }
  }, [user, authLoading])

  const fetchCart = async () => {
    try {
      const response = await getCart(user._id)
      setCart(response.data)
    } catch (error) {
      setError('Failed to fetch cart')
      console.error('Error fetching cart:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await getProducts()
      const productsMap = response.data.reduce((acc, product) => {
        acc[product._id] = product
        return acc
      }, {})
      setProducts(productsMap)
    } catch (error) {
      setError('Failed to fetch products')
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      await updateCartItem(user.id, productId, newQuantity)
      setCart(prevCart => ({
        ...prevCart,
        [productId]: newQuantity
      }))
    } catch (error) {
      console.error('Error updating cart:', error)
    }
  }

  const handleRemoveItem = async (productId) => {
    try {
      await removeCartItem(user.id, productId)
      setCart(prevCart => {
        const newCart = { ...prevCart }
        delete newCart[productId]
        return newCart
      })
    } catch (error) {
      console.error('Error removing item from cart:', error)
    }
  }

  const handleProceedToCheckout = () => {
    router.push('/checkout');
  };

  if (loading) return <div className="text-center mt-8">Loading cart...</div>
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>

  const cartItems = Object.entries(cart)

  if (cartItems.length === 0) {
    return <div className="text-center mt-8">Your cart is empty</div>
  }

  const total = cartItems.reduce((sum, [productId, quantity]) => {
    const product = products[productId]
    return sum + (product ? product.price * quantity : 0)
  }, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
      <div className="space-y-8">
        {cartItems.map(([productId, quantity]) => {
          const product = products[productId]
          if (!product) return null
          return (
            <div key={productId} className="flex items-center space-x-4 border-b pb-4">
              <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover" />
              <div className="flex-grow">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-600">${product.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleUpdateQuantity(productId, quantity - 1)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => handleUpdateQuantity(productId, quantity + 1)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleRemoveItem(productId)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          )
        })}
      </div>
      <div className="mt-8 text-right">
        <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
        <button onClick={handleProceedToCheckout} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}