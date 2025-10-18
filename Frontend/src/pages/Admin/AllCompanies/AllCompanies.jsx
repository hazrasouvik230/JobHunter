// import axios from 'axios';
// import React, { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'

// const AllCompanies = () => {
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     (async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get("http://localhost:3000/api/admin/companies", { headers: { Authorization: token } });
//         console.log(response.data);
//       } catch (error) {
//         console.log(error);
//       }
//     })();
//   }, []);

//   {
//     loading && <p>Loading...</p>
//   }
//   return (
//     <div className='px-6 md:px-32 py-12 bg-gray-50 min-h-screen'>
//       <div className='text-center mb-8 mt-16 relative'>
//           <div className="absolute left-0 top-0"><Link to="/" className="text-gray-600 hover:text-blue-800 hover:font-semibold transition-all">Back</Link></div>

//           <p className='text-4xl font-bold text-gray-900 mb-4'>All Companies</p>
//           <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Find the best talent for your company.</p>
//       </div>
//     </div>
//   )
// }

// export default AllCompanies









import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaUserAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const AllCompanies = () => {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(9);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/admin/companies", { headers: { Authorization: token } });
        setCompanies(response.data.companies);

        setTotalPages(Math.ceil(response.data.companies.length / limit));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [limit]);

  const handlePageChange = (newPage) => {
      setPage(newPage);
  };

  const paginationInfo = data => {
      if(!data) return [];

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      return data.slice(startIndex, endIndex);
  };

  if (loading) {
    return (
      <div className='px-6 md:px-32 py-12 bg-gray-50 min-h-screen flex items-center justify-center'>
        <p className='text-xl text-gray-600'>Loading...</p>
      </div>
    );
  }

  return (
    <div className='px-6 md:px-32 py-12 bg-gray-50 min-h-screen'>
      <div className='text-center mb-8 mt-16 relative'>
        <div className="absolute left-0 top-0">
          <Link to="/" className="text-gray-600 hover:text-blue-800 hover:font-semibold transition-all">Back</Link>
        </div>

        <p className='text-4xl font-bold text-gray-900 mb-4'>All Companies</p>
        <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Find the best talent for your company.</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8'>
        {paginationInfo(companies).map((company) => (
          <div key={company._id} className='bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100'>
            <div className='bg-gradient-to-r from-blue-500 to-purple-600 opacity-80 p-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-white font-bold text-lg truncate'>{company.companyName}</h3>
                {company.companyLogo && (
                  <img 
                    src={`http://localhost:3000/uploads/company-logos/${company.companyLogo}`} 
                    alt={company.companyName}
                    className='w-12 h-12 object-contain bg-white rounded-lg p-1'
                  />
                )}
              </div>
            </div>
            
            {/* Content */}
            <div className='p-6'>
              <div className='space-y-3'>
                <div className='flex items-center text-gray-700 gap-2'><MdEmail className='text-gray-400 text-xl' /><span className='text-sm'>{company.email}</span></div>
                <div className='flex items-center text-gray-700 gap-2'><FaUserAlt className='text-gray-400 text-base mr-1' /><span className='text-sm'>{company.name}</span></div>
              </div>
              
              {/* Action Buttons */}
              <div className='mt-6 flex space-x-3'>
                <button className='flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer'>View Details</button>
                <button className='flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer'>Contact</button>
              </div>
            </div>
          </div>
        ))}
      </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
                <button 
                    className={`py-2 px-6 rounded-lg font-semibold transition-all ${
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
                    className={`py-2 px-6 rounded-lg font-semibold transition-all ${
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

      {/* Empty State */}
      {companies.length === 0 && (
        <div className='text-center py-12'>
          <p className='text-xl text-gray-600'>No companies found.</p>
        </div>
      )}
    </div>
  )
}

export default AllCompanies