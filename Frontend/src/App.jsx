import Navbar from './Navbar'
import Footer from './Footer'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/HomePage/Home';
import Profile from "./pages/Profile/Profile";

import Dashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import AllUsers from "./pages/Admin/AllUsers/AllUsers";
import SpecificUserDetails from './pages/Admin/SpecificUserDetails/SpecificUserDetails';
import AllCompanies from "./pages/Admin/AllCompanies/AllCompanies";
import Revenue from "./pages/Admin/Revenue/Revenue";

import PostJob from "./pages/HR/PostJob/PostJob";
import AllPostedJobs from "./pages/HR/AllPostedJobs/AllPostedJobs";
import HRSpecificJob from './pages/HR/HRSpecificJob/HRSpecificJob';
import HRInterview from "./pages/HR/Interview/HRInterview";
import Subscription from "./pages/HR/Subscription/Subscription";

import AllJobs from "./pages/User/AllJobs/AllJobs";
import AppliedJobs from './pages/User/AppliedJobs/AppliedJobs';
import SavedJobs from "./pages/User/SavedJobs/SavedJobs";
import UserInterview from "./pages/User/Interview/UserInterview";
import ApplyJob from './pages/User/ApplyJob/ApplyJob';
import HRProfilePage from './pages/HR/ProfilePage/HRProfile';
import Interview from './Interview';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/hr_profile" element={<HRProfilePage />} />

        {/* Admin pages */}
        <Route path='/admin/dashboard' element={<Dashboard />} />
        <Route path='/admin/all-companies' element={<AllCompanies />} />
        <Route path='/admin/all-users' element={<AllUsers />} />
        <Route path='/admin/specific-users/:id' element={<SpecificUserDetails />} />
        <Route path='/admin/revenue' element={<Revenue />} />

        {/* HR pages */}
        <Route path='/hr/post-job' element={<PostJob />} />
        <Route path='/hr/all-posted-jobs' element={<AllPostedJobs />} />
        <Route path='/hr/specific-job/:id' element={<HRSpecificJob />} />
        <Route path='/hr/interview' element={<HRInterview />} />
        <Route path='/hr/buy-subscription' element={<Subscription />} />
        
        {/* User pages */}
        <Route path='/user/all-jobs' element={<AllJobs />} />
        <Route path='/user/apply-job/:id' element={<ApplyJob />} />
        <Route path='/user/applied-jobs' element={<AppliedJobs />} />
        <Route path='/user/saved-jobs' element={<SavedJobs />} />
        <Route path='/user/interview' element={<UserInterview />} />

        <Route path='/interview/:id' element={<Interview />} />
      </Routes>
      
      <Footer />
    </BrowserRouter>
  )
}

export default App





















// import Navbar from './Navbar'
// import Footer from './Footer'
// import { BrowserRouter, Routes, Route } from 'react-router-dom'

// import Home from './pages/HomePage/Home';
// import Profile from "./pages/Profile/Profile";

// import Dashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
// import AllUsers from "./pages/Admin/AllUsers/AllUsers";
// import AllCompanies from "./pages/Admin/AllCompanies/AllCompanies";
// import Revenue from "./pages/Admin/Revenue/Revenue";

// import PostJob from "./pages/HR/PostJob/PostJob";
// import AllPostedJobs from "./pages/HR/AllPostedJobs/AllPostedJobs";
// import HRSpecificJob from './pages/HR/HRSpecificJob/HRSpecificJob';
// import HRInterview from "./pages/HR/Interview/HRInterview";

// import AllJobs from "./pages/User/AllJobs/AllJobs";
// import AppliedJobs from './pages/User/AppliedJobs/AppliedJobs';
// import SavedJobs from "./pages/User/SavedJobs/SavedJobs";
// import UserInterview from "./pages/User/Interview/UserInterview";
// import ApplyJob from './pages/User/ApplyJob/ApplyJob';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import JobContext from './context/JobContext';

// const App = () => {
//   const [allPostedJobs, setAllPostedJobs] = useState([]);
//   const [liveJobs, setLiveJobs] = useState([]);

//   const fetchJobs = async() => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const response = await axios.get("http://localhost:3000/api/job/allPostedJobsByHR", { headers: { Authorization: token } });
//       console.log(response.data.jobs || []);  //(5) [{…}, {…}, {…}, {…}, {…}]
//       setAllPostedJobs(response.data.jobs);
//       setLiveJobs(response.data.jobs.filter(job => new Date(job.deadline).getTime() > Date.now()) || []);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   return (
//     <BrowserRouter>
//       {/* <JobContext.Provider value={{ allPostedJobs, setAllPostedJobs, liveJobs, setLiveJobs }}> */}
//       <Navbar />

//       <Routes>
//         <Route path='/' element={<Home />} />
//         <Route path="/profile" element={<Profile />} />

//         {/* Admin pages */}
//         <Route path='/admin/dashboard' element={<Dashboard />} />
//         <Route path='/admin/all-companies' element={<AllCompanies />} />
//         <Route path='/admin/all-users' element={<AllUsers />} />
//         <Route path='/admin/revenue' element={<Revenue />} />

//         {/* HR pages */}
//         <Route path='/hr/post-job' element={<PostJob />} />
//         <Route path='/hr/all-posted-jobs' element={<AllPostedJobs />} />
//         <Route path='/hr/specific-job/:id' element={<HRSpecificJob />} />
//         <Route path='/hr/interview' element={<HRInterview />} />
        
//         {/* User pages */}
//         <Route path='/user/all-jobs' element={<AllJobs />} />
//         <Route path='/user/apply-job/:id' element={<ApplyJob />} />
//         <Route path='/user/applied-jobs' element={<AppliedJobs />} />
//         <Route path='/user/saved-jobs' element={<SavedJobs />} />
//         <Route path='/user/interview' element={<UserInterview />} />
//       </Routes>
      
//       <Footer />
//       {/* </JobContext.Provider> */}
//     </BrowserRouter>
//   )
// }

// export default App


































// import React from 'react'
// import Navbar from './Navbar'
// import Footer from './Footer'
// import { BrowserRouter, Routes, Route } from 'react-router-dom'

// import Home from './pages/HomePage/Home';
// import Profile from "./pages/Profile/Profile";

// import Dashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
// import AllUsers from "./pages/Admin/AllUsers/AllUsers";
// import AllCompanies from "./pages/Admin/AllCompanies/AllCompanies";
// import Revenue from "./pages/Admin/Revenue/Revenue";

// import PostJob from "./pages/HR/PostJob/PostJob";
// import AllPostedJobs from "./pages/HR/AllPostedJobs/AllPostedJobs";
// import HRSpecificJob from './pages/HR/HRSpecificJob/HRSpecificJob';
// import HRInterview from "./pages/HR/Interview/HRInterview";

// import AllJobs from "./pages/User/AllJobs/AllJobs";
// import AppliedJobs from './pages/User/AppliedJobs/AppliedJobs';
// import SavedJobs from "./pages/User/SavedJobs/SavedJobs";
// import UserInterview from "./pages/User/Interview/UserInterview";
// import ApplyJob from './pages/User/ApplyJob/ApplyJob';
// import { AuthProvider } from './context/AuthContext';
// import { JobsProvider } from './context/JobsContext';

// const App = () => {
//   return (
//     <AuthProvider>
//       <JobsProvider>
//         <BrowserRouter>
//           <Navbar />

//           <Routes>
//             <Route path='/' element={<Home />} />
//             <Route path="/profile" element={<Profile />} />

//             {/* Admin pages */}
//             <Route path='/admin/dashboard' element={<Dashboard />} />
//             <Route path='/admin/all-companies' element={<AllCompanies />} />
//             <Route path='/admin/all-users' element={<AllUsers />} />
//             <Route path='/admin/revenue' element={<Revenue />} />

//             {/* HR pages */}
//             <Route path='/hr/post-job' element={<PostJob />} />
//             <Route path='/hr/all-posted-jobs' element={<AllPostedJobs />} />
//             <Route path='/hr/specific-job/:id' element={<HRSpecificJob />} />
//             <Route path='/hr/interview' element={<HRInterview />} />
            
//             {/* User pages */}
//             <Route path='/user/all-jobs' element={<AllJobs />} />
//             <Route path='/user/apply-job/:id' element={<ApplyJob />} />
//             <Route path='/user/applied-jobs' element={<AppliedJobs />} />
//             <Route path='/user/saved-jobs' element={<SavedJobs />} />
//             <Route path='/user/interview' element={<UserInterview />} />
//           </Routes>
          
//           <Footer />
//         </BrowserRouter>
//       </JobsProvider>
//     </AuthProvider>
//   )
// }

// export default App