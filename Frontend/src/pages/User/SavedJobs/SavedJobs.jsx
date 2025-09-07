import React, { useEffect, useState } from 'react'
import axios from 'axios';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    (async() => {
      try {
        const token = localStorage.getItem("token");
        const resposnse = await axios.get("http://localhost:3000/api/savedJobs", { headers: { Authorization: token } });
        console.log(resposnse.data);
        setSavedJobs(resposnse.data.savedJobs)
      } catch (error) {
        console.log(error);
      }
    })();
  }, [])
  return (
    <div className='px-32 py-16'>
      <p className='text-3xl font-semibold text-shadow-lg pb-8'>Saved Jobs</p>

      <div>
        {
          savedJobs.length > 0 ?
            <></> :
            <p>No job is selected as your favourit job.</p>
        }
      </div>
    </div>
  )
}

export default SavedJobs