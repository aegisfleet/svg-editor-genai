import React from 'react';

interface ErrorDialogProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <p className="text-lg text-red-600 dark:text-red-400">Error</p>
        <p className="mt-2 text-gray-800 dark:text-gray-200">{message}</p>
        <button 
          onClick={onClose} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorDialog;
