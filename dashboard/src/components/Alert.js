// src/components/Alert.js
import React from 'react';

const Alert = ({ type, message, onClose }) => {
  const alertClasses = {
    success: 'bg-green-100 text-green-700 border-green-300',
    error: 'bg-red-100 text-red-700 border-red-300',
    info: 'bg-blue-100 text-blue-700 border-blue-300',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  };

  return (
    <div className={`fixed top-4 right-4 w-1/3 p-4 border rounded-lg shadow-lg ${alertClasses[type]}`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-lg font-bold">×</button>
      </div>
    </div>
  );
};

export default Alert;
