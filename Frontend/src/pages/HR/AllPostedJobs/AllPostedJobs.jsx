import React, { useState } from 'react'

const AllPostedJobs = () => {
  const allPostedJobs = [];
    return (
      <div className='px-32 py-16'>
        <p className='text-3xl font-medium text-shadow-md pb-8'>All Posted Jobs</p>

        <div>
            {
            allPostedJobs.length > 0 ?
                <></> :
                <p>You've not post any job yet.</p>
            }
        </div>
      </div>
    )
}

export default AllPostedJobs