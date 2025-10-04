import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async() => {
      try {
        const response = await axios.get("http://localhost:3000/api/list");
        console.log(response.data.users);
        setUsers(response.data.users);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);

  const handleRemove = (id) => {
    const confirmation = window.confirm("Are you sure to remove this user?");
    if(confirmation) {
      const newArr = users.filter(user => user._id !== id);
      setUsers(newArr);
    }
  };

  const navigate = useNavigate();
  const handleUser = (id) => {
    alert(`Switching to ${id}`);
    navigate(`/admin/specific-users/${id}`);
  };

  return (
    <div className='px-32 py-16 bg-amber-300/80'>
      <p className='text-3xl font-medium text-shadow-md pb-8 mt-24'>All Users</p>

      <div className='p-4'>
        {
          users && (
            users.map((user) => {
              return <div key={user._id} className='flex items-center justify-between bg-amber-100 my-4 px-8 py-2 rounded-md hover:shadow-lg hover:scale-101'>
                <div>
                  <p className='text-lg font-medium'>Username: {user.name}</p>
                  <p className='text-xs'>Role of the user: {user.role}</p>
                </div>

                <div className='flex gap-2'>
                  <button className='bg-gradient-to-r from-lime-300 to-lime-500 px-6 py-2 text-white font-medium rounded cursor-pointer hover:scale-105' onClick={() => handleUser(user._id)}>Show details</button>
                  <button className='bg-red-500/60 px-6 py-2 text-white font-medium rounded cursor-pointer hover:scale-105' onClick={() => handleRemove(user._id)}>Remove</button>
                </div>
              </div>
            })
          )
        }
      </div>
    </div>
  )
}

export default AllUsers