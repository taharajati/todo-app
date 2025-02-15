import React from 'react';

function Modal({ message, onClose }) {
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
          <h2 className="text-xl font-bold mb-4">پیغام</h2>
          <p>{message}</p>
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    );
  }

export default Modal;
