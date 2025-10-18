import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const AllCompanies = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/admin/companies", { headers: { Authorization: token } });
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  {
    loading && <p>Loading...</p>
  }
  return (
    <div className='px-6 md:px-32 py-12 bg-gray-50 min-h-screen'>
      <div className='text-center mb-8 mt-16 relative'>
          <div className="absolute left-0 top-0"><Link to="/" className="text-gray-600 hover:text-blue-800 hover:font-semibold transition-all">Back</Link></div>

          <p className='text-4xl font-bold text-gray-900 mb-4'>All Companies</p>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Find the best talent for your company.</p>
      </div>
    </div>
  )
}

export default AllCompanies