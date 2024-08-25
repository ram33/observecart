import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { getCart, createOrder, clearCart, placeOrder } from '../api';
import Alert from '../components/Alert';

export default function Checkout() {
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return; // Don't do anything while auth is loading

    if (user) {
      fetchCart();
    } else {
      router.push('/login');
    }
  }, [user, authLoading]);

  const fetchCart = async () => {
    try {
      const response = await getCart(user._id);
      setCart(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch cart');
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const orderResponse = await placeOrder(user._id, cart);
      await clearCart(user._id);
      setAlert({ message: 'Order placed successfully!', type: 'success' });
      setTimeout(() => {
        router.push(`/order-confirmation?orderId=${orderResponse.data.orderId}`);
      }, 500);
    } catch (error) {
      setAlert({ message: 'Failed to place order', type: 'error' });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Order Summary</h2>
        {Object.entries(cart).map(([productId, quantity]) => (
          <div key={productId} className="flex justify-between py-2">
            <span>Product {productId}</span>
            <span>Quantity: {quantity}</span>
          </div>
        ))}
        <div className="mt-4 pt-4 border-t">
          <button
            onClick={handlePlaceOrder}
            className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}