import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getProduct, addToCart } from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import Alert from '../../components/Alert';

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await getProduct(id);
      setProduct(response.data);
    } catch (error) {
      setError('Failed to fetch product');
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      await addToCart(user._id, product._id, 1);
      setAlert({ message: 'Product added to cart successfully', type: 'success' });
    } catch (error) {
      setAlert({ message: 'Failed to add product to cart', type: 'error' });
      console.error('Error adding product to cart:', error);
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!product) return <div className="text-center mt-8">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Image */}
        <div className="flex-shrink-0">
          <img
            className="h-64 w-full object-cover sm:h-96 lg:w-full lg:h-full"
            src={product.imageUrl}
            alt={product.name}
          />
        </div>

        {/* Product details */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
          <div className="mt-3">
            <p className="text-3xl text-gray-900">${product.price.toFixed(2)}</p>
          </div>
          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="text-base text-gray-700">{product.description}</div>
          </div>
          <div className="mt-10">
            <button
              onClick={handleAddToCart}
              className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}