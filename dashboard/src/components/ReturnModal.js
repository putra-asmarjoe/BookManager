import React, { useState, useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import axios from 'axios';
import Alert from './Alert';

const apiHost = process.env.REACT_APP_API_HOST;

const BorrowModal = ({ isOpen, onClose, borrowId, onSave }) => {   
  const [borrowData, setBorrowData] = useState(null);
  const [returnDate, setReturnDate] = useState('');
  const [alert, setAlert] = useState({ type: '', message: '', visible: false });
           
  useEffect(() => {
    if (isOpen && borrowId) {
        
        setAlert({ ...alert, visible: false })
      const fetchBorrowData = async () => {
        try {
          const response = await axios.get(`${apiHost}borrows/${borrowId}`);
          setBorrowData(response.data);
          const today = new Date().toISOString().split('T')[0];
          setReturnDate(today);
        } catch (error) {
          console.error('Error fetching borrow data:', error);
        }
      };

      fetchBorrowData();
    }
  }, [isOpen, borrowId, alert]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!borrowData) {
        setAlert({
          type: 'error',
          message: 'Borrow data not available.',
          visible: true,
        });
        return;
      }
      
      

      const borrowDate = new Date(borrowData.borrowDate);
      const formattedBorrowDate = borrowDate.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      
    const today = new Date().toISOString().split('T')[0];
    if (returnDate > today) {
      setAlert({
        type: 'error',
        message: 'Return date cannot exceed todays date.',
        visible: true,
      });
      return;
    }
  
      const returnDateObj = new Date(returnDate);
      if (returnDateObj < borrowDate) {
        setAlert({
          type: 'error',
          message: `Return date cannot be earlier than borrow date (${formattedBorrowDate}).`,
          visible: true,
        });
        return;
      }
    
      
      
      try {
      await axios.put(`${apiHost}borrows/${borrowId}`, { returnDate });
      
      
      setAlert({
        type: 'success',
        message: 'Borrowing data has been successfully saved!',
        visible: true,
      });
      onSave();
      
      setTimeout(() => {
        onClose();
      }, 1000); 
      
      
      
    } catch (error) {
        if (error.response) {
          setAlert({
            type: 'error',
            message: error.response.data.message || 'An error occurred.',
            visible: true,
          });
        } else {
          setAlert({
            type: 'error',
            message: 'Network error occurred.',
            visible: true,
          });
        }
    }
  };

  if (!borrowData) {
    return (
      <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg">
          <p>Loading borrow details...</p>
        </Dialog.Panel>
      </Dialog>
    );
  }

  const { member, book, borrowDate } = borrowData;

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };


  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
    <DialogBackdrop
      transition
      className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
    />

    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <DialogPanel
          transition
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
        >
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          
                
        
        <div className="mt-2">
        <h2 className="text-xl font-bold mb-4">Borrow Details</h2>
        <p className="mb-4"><strong>Member:</strong> {member.name}</p>
        <p className="mb-4"><strong>Member Code:</strong> {member.code}</p>
        <p className="mb-4"><strong>Book Title:</strong> {book.title}</p>
        <p className="mb-4"><strong>Author:</strong> {book.author}</p>
        <p className="mb-4"><strong>Borrow Date:</strong> {formatDate(borrowDate)}</p>
        <label className="block mb-4">
          <span className="text-gray-700">Return Date</span>
          <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            className="form-input mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            required
          />
        </label>
               </div>
               
               
               
               
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
           
            
            
            <button
          type="submit"
          className="inline-flex px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleSubmit}
        >
          Return
        </button>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex mx-3 ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
            
          </div>
        </DialogPanel>
      </div>
    </div>
    
    
    <div className="mt-2">
        {alert.visible && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ ...alert, visible: false })}
          />
        )}
        </div>
  </Dialog>
  );
};

export default BorrowModal;
