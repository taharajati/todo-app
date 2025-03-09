import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Modal({ message, onClose }) {
  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-80 relative z-10"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">پیغام</h2>
        <p className="text-gray-700 dark:text-gray-300">{message}</p>
        <div className="mt-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            بستن
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default Modal;
