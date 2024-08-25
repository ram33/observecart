import { useRouter } from 'next/router';
import Link from 'next/link';

export default function OrderConfirmation() {
  const router = useRouter();
  const { orderId } = router.query;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Order Confirmed!</h1>
      <p className="mb-4">Thank you for your purchase.</p>
      {orderId && <p className="mb-4">Your order ID is: {orderId}</p>}
      <Link href="/">
        <a className="text-indigo-600 hover:text-indigo-800">Continue Shopping</a>
      </Link>
    </div>
  );
}