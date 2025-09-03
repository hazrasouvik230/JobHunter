import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/HomePage/Home';
import Profile from "./Profile";

import Dashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import AllUsers from "./pages/Admin/AllUsers/AllUsers";
import AllCompanies from "./pages/Admin/AllCompanies/AllCompanies";
import Revenue from "./pages/Admin/Revenue/Revenue";

import PostJob from "./pages/HR/PostJob/PostJob";
import AllPostedJobs from "./pages/HR/AllPostedJobs/AllPostedJobs";
import HRSpecificJob from './pages/HR/HRSpecificJob/HRSpecificJob';
import HRInterview from "./pages/HR/Interview/HRInterview";

import AllJobs from "./pages/User/AllJobs/AllJobs";
import AppliedJobs from './pages/User/AppliedJobs/AppliedJobs';
import SavedJobs from "./pages/User/SavedJobs/SavedJobs";
import UserInterview from "./pages/User/Interview/UserInterview";
import ApplyJob from './pages/User/ApplyJob/ApplyJob';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin pages */}
        <Route path='/admin/dashboard' element={<Dashboard />} />
        <Route path='/admin/all-companies' element={<AllCompanies />} />
        <Route path='/admin/all-users' element={<AllUsers />} />
        <Route path='/admin/revenue' element={<Revenue />} />

        {/* HR pages */}
        <Route path='/hr/post-job' element={<PostJob />} />
        <Route path='/hr/all-posted-jobs' element={<AllPostedJobs />} />
        <Route path='/hr/specific-job/:id' element={<HRSpecificJob />} />
        <Route path='/hr/interview' element={<HRInterview />} />
        
        {/* User pages */}
        <Route path='/user/all-jobs' element={<AllJobs />} />
        <Route path='/user/apply-job/:id' element={<ApplyJob />} />
        <Route path='/user/applied-jobs' element={<AppliedJobs />} />
        <Route path='/user/saved-jobs' element={<SavedJobs />} />
        <Route path='/user/interview' element={<UserInterview />} />
      </Routes>
      
      <Footer />
    </BrowserRouter>
  )
}

export default App