import React, { useState } from 'react'

const Profile = () => {
    const [address, setAddress] = useState("");
    const [mobile, setMobile] = useState("+91 ");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`Name: ${name}, email: ${email}, Address: ${address}, mobile: ${mobile}`);
    }

    return (
        <div className='px-32 py-16'>
            <p className='text-3xl font-semibold text-shadow-lg pb-8'>Profile</p>
            <form onSubmit={handleSubmit}>
                <div className="w-full h-36 my-4 rounded-2xl bg-gradient-to-r from-pink-400 via-yellow-300 to-blue-400 animate-gradient bg-[length:400%_400%]">
                </div>

                <style jsx>
                {`
                    @keyframes gradient {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                    }

                    .animate-gradient {
                    animation: gradient 10s ease infinite;
                    }
                `}
                </style>

                {/* Image Section */}
                <div className="mb-3">
                    <input type="file" name="image" id="image" className='border border-gray-300 w-full p-1.5 px-3 rounded' placeholder='Please enter your name' />
                </div>

                {/* Name Section */}
                <div className="mb-3">
                    <label htmlFor="name">Fullname</label><br />
                    <input type="text" name="name" id="name" className='border border-gray-300 w-full p-1.5 px-3 rounded' />
                </div>

                {/* Email Section */}
                <div className="mb-3">
                    <label htmlFor="email">Email</label><br />
                    <input type="email" name="email" id="email" className='border border-gray-300 w-full p-1.5 px-3 rounded' />
                </div>

                {/* Mobile Section */}
                <div className="mb-3">
                    <label htmlFor="mobile">Mobile</label>
                    <input type="text" name="mobile" id="mobile" className='border border-gray-300 w-full p-1.5 px-3 rounded' value={mobile} onChange={(e) => setMobile(e.target.value)} />
                </div>

                {/* Address Section */}
                <div className="mb-3">
                    <label htmlFor="address">Address</label><br />
                    <input type="text" name="address" id="address" className='border border-gray-300 w-full p-1.5 px-3 rounded' placeholder='Please enter your full address' value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>

                <div className='mt-4 flex items-center justify-center'>
                    <input type="submit" value="Save" className='bg-cyan-600/50 text-white px-20 py-2 text-xl font-semibold rounded cursor-pointer hover:scale-110 duration-300 ease-in-out hover:shadow-lg' />
                </div>
            </form>
        </div>
    )
}

export default Profile