// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BorrowModal from '../components/BorrowModal';
import ReturnModal from '../components/ReturnModal'; 

const apiHost = process.env.REACT_APP_API_HOST;

const Dashboard = () => {
  const [borrows, setBorrows] = useState([]);
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedBorrow, setSelectedBorrow] = useState(null);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);

  useEffect(() => {
    fetchBorrows();    
    fetchMembers();
    fetchBooks();
  }, []);

  const fetchBorrows = async () => {
    const response = await axios.get(`${apiHost}borrows`);
    setBorrows(response.data);
  };
  const fetchMembers = async () => {
    const response = await axios.get(`${apiHost}members`);
    setMembers(response.data);
  }; const fetchBooks = async () => {
    const response = await axios.get(`${apiHost}books`);
    setBooks(response.data);
  };
  
  const handleOpenBorrowModal = () => {
    setShowBorrowModal(true);
  };

  const handleOpenReturnModal = (borrowId) => {
    setSelectedBorrow({ id: borrowId });
    setShowReturnModal(true);
  };

  const handleSave = () => {
    fetchBorrows();
    fetchMembers();
    fetchBooks();
  };
  
  const memberBorrowCount = members.reduce((acc, member) => {
    acc[member.id] = 0;
    return acc;
  }, {});

  borrows.forEach(borrow => {
    if (!borrow.returnDate) {
      memberBorrowCount[borrow.member.id] = (memberBorrowCount[borrow.member.id] || 0) + 1;
    }
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <button
        onClick={() => handleOpenBorrowModal(null)}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
       Borrow Book
      </button>
      <table className="min-w-full mt-4 border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b text-left">Member Name</th>
            <th className="px-4 py-2 border-b text-left">Book Title</th>
            <th className="px-4 py-2 border-b text-left">Book Author</th>
            <th className="px-4 py-2 border-b text-left">Borrow Date</th>
            <th className="px-4 py-2 border-b text-left">Return Date</th>
            <th className="px-4 py-2 border-b text-left">Is Late</th>
            <th className="px-4 py-2 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
  {borrows.map((borrow) => {
    const borrowDate = new Date(borrow.borrowDate);
    const returnDate = borrow.returnDate ? new Date(borrow.returnDate) : null;
    const gracePeriodDays = 6;

    let isLate = '';
    if (returnDate) {
      const daysOverdue = Math.floor((returnDate - borrowDate) / (1000 * 60 * 60 * 24)) - gracePeriodDays;
      isLate = daysOverdue > 0 ? `${daysOverdue} days` : 'On Time';
    }

    return (
      <tr key={borrow.id}>
        <td className="px-4 py-2 border-b">{borrow.member.name}</td>
        <td className="px-4 py-2 border-b">{borrow.book.title}</td>
        <td className="px-4 py-2 border-b">{borrow.book.author}</td>
        <td className="px-4 py-2 border-b">
          {new Date(borrow.borrowDate).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </td>
        <td className="px-4 py-2 border-b">
          {returnDate
            ? new Date(returnDate).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            : ''}
        </td>
        <td className="px-4 py-2 border-b">{isLate}</td>
        <td className="px-4 py-2 border-b">
          {!returnDate && (
            <button
              onClick={() => handleOpenReturnModal(borrow.id)}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Return
            </button>
          )}
        </td>
      </tr>
    );
  })}
</tbody>
      </table>
      
       
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Members Table */}
        <div className="col-span-1">
          <h2 className="text-xl font-bold mb-4">Members</h2>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-left">Member ID</th>
                <th className="px-4 py-2 border-b text-left">Name</th>
                <th className="px-4 py-2 border-b text-left">Code</th>
                <th className="px-4 py-2 border-b text-left">Books Borrowed</th>
                <th className="px-4 py-2 border-b text-left">Penalty</th>
                <th className="px-4 py-2 border-b text-left">Penalty End Date</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td className="px-4 py-2 border-b">{member.id}</td>
                  <td className="px-4 py-2 border-b">{member.name}</td>
                  <td className="px-4 py-2 border-b">{member.code}</td>
                  <td className="px-4 py-2 border-b">{memberBorrowCount[member.id] || 0}</td>
                  <td className="px-4 py-2 border-b">{member.penalty ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 border-b">
                    {member.penaltyEndDate
                      ? new Date(member.penaltyEndDate).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Books Table */}
        <div className="col-span-1">
          <h2 className="text-xl font-bold mb-4">Available Books</h2>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-left">Title</th>
                <th className="px-4 py-2 border-b text-left">Author</th>
                <th className="px-4 py-2 border-b text-left">Quantity</th>
                <th className="px-4 py-2 border-b text-left">Available</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => {
                const borrowedCount = borrows.filter(borrow => borrow.book.id === book.id && !borrow.returnDate).length;
                const availableQuantity = book.stock - borrowedCount;

                return (
                  <tr key={book.id}>
                    <td className="px-4 py-2 border-b">{book.title}</td>
                    <td className="px-4 py-2 border-b">{book.author}</td>
                    <td className="px-4 py-2 border-b">{book.stock}</td>
                    <td className="px-4 py-2 border-b">{availableQuantity}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>


      <BorrowModal
        isOpen={showBorrowModal}
        onClose={() => setShowBorrowModal(false)}
        onSave={handleSave}
      />
      <ReturnModal
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        borrowId={selectedBorrow?.id}
        onSave={handleSave}
      />
    </div>
  );
};

export default Dashboard;
