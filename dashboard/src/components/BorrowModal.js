import React, { useState, useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel} from '@headlessui/react'
import axios from 'axios';
import { toast } from 'react-toastify';
import Alert from './Alert';

const apiHost = process.env.REACT_APP_API_HOST;

const BorrowModal = ({ isOpen, onClose, borrow, onSave }) => {
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [borrowDate, setBorrowDate] = useState('');
  const [alert, setAlert] = useState({ type: '', message: '', visible: false });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersResponse, booksResponse] = await Promise.all([
          axios.get(`${apiHost}members`),
          axios.get(`${apiHost}books`)
        ]);
        setMembers(membersResponse.data);
        setBooks(booksResponse.data);
      } catch (error) {
        setAlert({
          type: 'error',
          message: 'Failed to fetch data.',
          visible: true,
        });
        toast.error('Failed to fetch data.');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setAlert({ type: '', message: '', visible: false });
      const today = new Date().toISOString().split('T')[0];
      setBorrowDate(today);
      
    }

    if (borrow) {
      setSelectedMember(borrow.memberId);
      setSelectedBook(borrow.bookId);
      setBorrowDate(new Date(borrow.borrowDate).toISOString().split('T')[0]);
    }
  }, [isOpen, borrow]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date().toISOString().split('T')[0];
    if (borrowDate > today) {
      setAlert({
        type: 'error',
        message: 'Borrow date cannot exceed todays date.',
        visible: true,
      });
      return;
    }

    try {
        await axios.post(`${apiHost}borrows`, {
            memberId: selectedMember,
            bookId: selectedBook,
            borrowDate,
          });
          
      onSave();
      onClose();
      
      toast.success('Borrowing data has been successfully saved!');
      
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

  return (<Dialog open={isOpen} onClose={onClose} className="relative z-10">
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
        <h2 className="text-xl font-bold mb-4">Borrow Book</h2>
        <form onSubmit={handleSubmit}>
       
          <label className="block mb-4">
            <span className="text-gray-700">Member</span>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              required
            >
              <option value="">Select a member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.code})
                </option>
              ))}
            </select>
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Book</span>
            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              required
            >
              <option value="">Select a book</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} by {book.author} ({book.code})
                </option>
              ))}
            </select>
          </label>
          
           
          <label className="block mb-4">
            <span className="text-gray-700">Borrow Date</span>
            <input
              type="date"
              value={borrowDate}
              onChange={(e) => setBorrowDate(e.target.value)}
              className="form-input mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              required
            />
          </label>

        </form>
               </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="submit"onClick={handleSubmit}
            className="inline-flex px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
           Create
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
