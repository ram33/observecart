import { useState, useEffect } from 'react';

export default function Alert({ message, type = 'success', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed top-12 right-5 ${bgColor} text-white px-6 py-3 rounded-md shadow-lg`}>
      <p>{message}</p>
    </div>
  );
}