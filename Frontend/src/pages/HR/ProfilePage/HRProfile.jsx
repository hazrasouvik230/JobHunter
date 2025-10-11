import { useContext, useRef, useState } from "react"
import { AuthContext } from "../../../context/AuthContext"
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

export default function HRProfilePage() {
    const { user, setUser } = useContext(AuthContext);
    
    const profileImageInputRef = useRef(null);
    const companyLogoInputRef = useRef(null);
    
    const [uploadingProfile, setUploadingProfile] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    
    const [profileImagePreview, setProfileImagePreview] = useState(storedUser?.profileImage ? `http://localhost:3000/uploads/profile-images/${storedUser.profileImage}` : "");
    
    const [companyLogoPreview, setCompanyLogoPreview] = useState(storedUser?.companyLogo ? `http://localhost:3000/uploads/company-logos/${storedUser.companyLogo}` : "");

    const handleFileChange = async (e, type) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size should be less than 5MB');
            return;
        }

        // Determine which type of upload
        const isProfileImage = type === 'profile';
        const setPreview = isProfileImage ? setProfileImagePreview : setCompanyLogoPreview;
        const setUploading = isProfileImage ? setUploadingProfile : setUploadingLogo;
        const fieldName = isProfileImage ? 'profileImage' : 'companyLogo';
        const endpoint = isProfileImage ? '/api/updateProfileImage' : '/api/updateCompanyLogo';
        const folderPath = isProfileImage ? 'profile-images' : 'company-logos';
        const successMessage = isProfileImage ? 'Profile image updated successfully!' : 'Company logo updated successfully!';
        const errorMessage = isProfileImage ? 'Failed to upload profile image' : 'Failed to upload company logo';

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload to server
        const formData = new FormData();
        formData.append(fieldName, file);

        try {
            setUploading(true);
            const token = localStorage.getItem('token');
            
            const response = await axios.put(`http://localhost:3000${endpoint}`, formData, { headers: { 'Authorization': token, 'Content-Type': 'multipart/form-data' } });

            if (response.data.success) {
                // Update user in context
                setUser(response.data.user);
                
                // Update user in localStorage
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                // Update preview with new image from server
                setPreview(`http://localhost:3000/uploads/${folderPath}/${response.data.user[fieldName]}`);
                
                alert(successMessage);
            }
        } catch (error) {
            console.error(`Error uploading ${type}:`, error);
            alert(error.response?.data?.message || errorMessage);
            
            // Revert preview on error
            const originalImage = storedUser?.[fieldName];
            setPreview(originalImage ? `http://localhost:3000/uploads/${folderPath}/${originalImage}` : "");
        } finally {
            setUploading(false);
        }
    };

    // Trigger file input clicks
    const handleProfileImageUpload = () => {
        profileImageInputRef.current?.click();
    };

    const handleCompanyLogoUpload = () => {
        companyLogoInputRef.current?.click();
    };
    
    return (
        <motion.div className='px-6 md:px-32 py-12 bg-blue-50' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
            <div className='text-center mb-8 mt-16'>
                <div className="absolute">
                    <span className="text-start hover:text-blue-800 cursor-pointer ease-in-out text-gray-600 hover:font-semibold"><Link to="/">Back</Link></span>
                </div>

                <h1 className='text-4xl font-bold text-gray-900 mb-4'>Welcome, {user?.name}</h1>
                <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Profile page</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto">
                {/* Profile Image Section */}
                <motion.div className="bg-gray-50 border-2 border-blue-200 rounded-lg p-8 hover:scale-101 hover:shadow-lg hover:shadow-blue-200 duration-150 ease-in-out" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                    <div className="flex gap-3">
                        <div className="relative">
                            <img src={profileImagePreview || "/Default-User.jpg"} alt="Profile" className="border rounded-md h-20 w-20 object-cover cursor-pointer hover:scale-105 hover:opacity-80 transition-opacity" onClick={handleProfileImageUpload} />
                            
                            {
                                uploadingProfile && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md"><span className="text-white text-xs">Uploading...</span></div>
                                )
                            }

                            <input type="file" ref={profileImageInputRef} onChange={(e) => handleFileChange(e, 'profile')} accept="image/*" className="hidden" />
                        </div>

                        <div>
                            <p className="text-xl font-semibold">{user?.name}</p>
                            <p className="text-gray-500 text-sm">{user?.email}</p>
                            <p className="text-gray-600">{user?.role} at {user?.companyName}</p>
                        </div>
                    </div>
                </motion.div>
                
                {/* Company Logo Section */}
                <motion.div className="bg-gray-50 border-2 border-blue-200 rounded-lg p-8 hover:scale-101 hover:shadow-lg hover:shadow-blue-200 duration-150 ease-in-out" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>
                    <div className="flex gap-3">
                        <div className="relative">
                            <img src={companyLogoPreview || "/default-company.png"} alt="Company Logo" className="border rounded-lg h-20 w-20 cursor-pointer hover:scale-105 hover:opacity-80 transition-opacity" onClick={handleCompanyLogoUpload} />

                            {
                                uploadingLogo && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg"><span className="text-white text-xs">Uploading...</span></div>
                                )
                            }

                            <input type="file" ref={companyLogoInputRef} onChange={(e) => handleFileChange(e, 'logo')} accept="image/*" className="hidden" />
                        </div>

                        <div>
                            <p className="font-medium text-lg">{user?.companyName}</p>
                            <p className="text-gray-600 text-sm">Location</p>
                        </div>
                    </div>
                </motion.div>
                
                {/* Hiring Funnel Overview */}
                <motion.div className="bg-gray-50 border-2 border-blue-200 rounded-lg p-8 hover:scale-101 hover:shadow-lg hover:shadow-blue-200 duration-150 ease-in-out" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.2 }}>
                    <p className="font-semibold mb-3">Hiring funnel overview</p>
                    <p className="text-gray-700">Total posted jobs: 0</p>
                    <p className="text-gray-700">Hired applicant: 0</p>
                    <p className="text-gray-700">Hired applicant per job post: 0%</p>
                </motion.div>
                
                {/* Interviews */}
                <motion.div className="bg-gray-50 border-2 border-blue-200 rounded-lg p-8 hover:scale-101 hover:shadow-lg hover:shadow-blue-200 duration-150 ease-in-out" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}>
                    <p className="font-semibold">Interviews</p>
                </motion.div>
            </div>
        </motion.div>
    )
}