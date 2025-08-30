import React from 'react'

const AppliedJobs = () => {
    const appliedJobs = [];
    return (
        <div className='px-32 py-16'>
            <p className='text-3xl font-semibold text-shadow-lg pb-8'>Applied Jobs</p>

            <div>
                {
                appliedJobs.length > 0 ?
                    <></> :
                    <p>Not applied for any job.</p>
                }
            </div>
        </div>
    )
}

export default AppliedJobs