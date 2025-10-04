import React from 'react'

const JobPilot = () => {
    const jobpilot = [
        { id: 1, image: "/Icon (2).png", title: "Create account", subtitle: "Sign up in just a few steps to get started with your job search." },
        { id: 2, image: "/Icon.png", title: "Upload CV/Resume", subtitle: "Add your resume to showcase your skills and experience to employers." },
        { id: 3, image: "/Icon (3).png", title: "Find suitable job", subtitle: "Browse through personalized job listings that match your profile." },
        { id: 4, image: "/Icon (4).png", title: "Apply job", subtitle: "Submit your application directly to employers and track your progress." }
    ];


  return (
    <div className='bg-slate-200/20 flex flex-col items-center justify-center px-4 py-12'>
        <p className='text-center text-2xl sm:text-3xl font-semibold mb-12'>How Job Pilot Works</p>
        <div className='flex flex-col sm:flex-row items-center justify-center gap-4 max-w-6xl w-full relative'>
            {
                jobpilot.map(ele => {
                    return <div key={ele.id} className='flex flex-col items-center justify-center w-64 p-4 gap-2 bg-cyan-100/50 ml-6 mr-6 pt-6 pb-6 rounded-lg shadow-lg text-center sm:m-0 sm:h-52 hover:scale-105 ease-in-out duration-300 hover:shadow-xl lg:h-auto'>
                        <img src={ele.image} alt="" className='w-10 sm:w-14 cursor-pointer' />
                        <p className='font-bold'>{ele.title}</p>
                        <p className='font-extralight text-xs text-gray-400'>{ele.subtitle}</p>
                    </div>
                })
            }
        </div>
    </div>
  )
}

export default JobPilot;