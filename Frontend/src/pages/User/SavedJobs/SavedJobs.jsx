import React from 'react'

const SavedJobs = () => {
  const savedJobs = [];
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