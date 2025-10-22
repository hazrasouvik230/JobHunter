import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);

  
  useEffect(() => {
    const fetchUsers = async() => {
      try {
        const response = await axios.get("http://localhost:3000/api/list");
        console.log(response.data.users);
        setUsers(response.data.users);
  
        setTotalPages(Math.ceil(response.data.users.length / limit));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [limit]);

  const handleRemove = async (id) => {
    const confirmation = window.confirm("Are you sure to remove this user?");
    if(confirmation) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`http://localhost:3000/api/admin/removeUser/${id}`, { headers: { Authorization: token }});
        console.log(response.data);

        if(response.data.success) {
          const newArr = users.filter(user => user._id !== id);
          setUsers(newArr);
          const newTotalPages = Math.ceil(newArr.length / limit);
          setTotalPages(newTotalPages);
          
          // If current page is now empty, go to previous page
          if (page > newTotalPages && newTotalPages > 0) {
            setPage(newTotalPages);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const navigate = useNavigate();

  const handleUser = (id) => {
    navigate(`/admin/specific-users/${id}`);
  };

  const roleCounter = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, { HR: 0, User: 0, Admin: 0});

  const handlePageChange = (newPage) => {
      setPage(newPage);
  };

  const paginationInfo = (data) => {
      if(!data) return [];

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      return data.slice(startIndex, endIndex);
  };

  return (
    <div className='px-6 md:px-32 py-12 bg-gray-50 min-h-screen'>
      <div className='text-center mb-8 mt-16 relative'>
          <div className="absolute left-0 top-0"><Link to="/" className="text-gray-600 hover:text-blue-800 hover:font-semibold transition-all">Back</Link></div>

          <p className='text-4xl font-bold text-shadow-lg text-gray-900 mb-4'>All Users List</p>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Track your users</p>
      </div>

      <div className='flex flex-col lg:flex-row gap-6'>
        <div className='bg-white border-2 border-gray-200 rounded-xl shadow-lg w-full lg:w-2/3 p-6'>
          {users.length > 0 ? (
            <>
              {paginationInfo(users).map((user) => (
                <div key={user._id} className='flex items-center justify-between bg-blue-50 my-4 p-4 px-6 rounded-lg hover:shadow-md transition-all duration-200 border border-blue-100'>
                  <div className="flex gap-4 items-center">
                    <img src={`http://localhost:3000/uploads/profile-images/${user.profileImage}`} alt={user.name} className='h-12 w-12 rounded-full border-2 border-blue-300 object-cover' 
                    />
                    <div>
                      <p className='text-lg font-semibold text-gray-800'>{user.name}</p>
                      <p className='text-sm text-gray-600'>Role: <span className={`font-medium ${
                        user.role === 'Admin' ? 'text-red-600' : 
                        user.role === 'HR' ? 'text-blue-600' : 'text-green-600'
                      }`}>{user.role}</span></p>
                      <p className='text-xs text-gray-500'>{user.email}</p>
                    </div>
                  </div>

                  {user.role !== "Admin" && (
                    <div className='flex gap-3'>
                      <button className='bg-blue-500 px-4 py-2 text-white font-medium rounded-lg cursor-pointer hover:bg-blue-600 transition-all duration-200 hover:scale-105'onClick={() => handleUser(user._id)}>View Details</button>
                      <button className='bg-red-500 px-4 py-2 text-white font-medium rounded-lg cursor-pointer hover:bg-red-600 transition-all duration-200 hover:scale-105'onClick={() => handleRemove(user._id)}>Remove</button>
                    </div>
                  )}
                </div>
              ))}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button 
                    className={`py-2 px-4 rounded-lg font-semibold transition-all ${
                      page === 1 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer'
                    }`}
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                  
                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, index) => (
                      <button 
                        key={index + 1}
                        className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                          page === index + 1 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
                        }`}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    className={`py-2 px-4 rounded-lg font-semibold transition-all ${
                      page === totalPages 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer'
                    }`}
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No users found.</p>
            </div>
          )}
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl shadow-lg p-6 w-full lg:w-1/3">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">User Statistics</h3>
          <div className="flex gap-4 flex-col">
            <div className='border text-center w-full py-4 rounded-lg bg-gradient-to-br from-red-400 to-red-500 text-white shadow-md'>
              <p className='text-2xl font-bold'>1</p>
              <p className='font-semibold'>Admin Users</p>
            </div>
            <div className='border text-center w-full py-4 rounded-lg bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-md'>
              <p className='text-2xl font-bold'>{roleCounter.HR}</p>
              <p className='font-semibold'>HR Managers</p>
            </div>
            <div className='border text-center w-full py-4 rounded-lg bg-gradient-to-br from-green-400 to-green-500 text-white shadow-md'>
              <p className='text-2xl font-bold'>{roleCounter.User}</p>
              <p className='font-semibold'>Students/Users</p>
            </div>
            <div className='border text-center w-full py-4 rounded-lg bg-gradient-to-br from-purple-400 to-purple-500 text-white shadow-md'>
              <p className='text-2xl font-bold'>{users.length}</p>
              <p className='font-semibold'>Total Users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllUsers