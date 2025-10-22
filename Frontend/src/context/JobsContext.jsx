
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const JobsContext = createContext();

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
};

export const JobsProvider = ({ children }) => {
  const { user, setUser } = useContext(AuthContext);
  const [allJobs, setAllJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    location: "All Locations",
    jobType: "All Types",
    salary: "Any Salary",
    experience: "Any Experience",
    sortBy: "Created at"
  });

  const fetchAllJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3000/api/job`, { 
        headers: { Authorization: token }
      });
      setAllJobs(response.data.jobs);
      setError(null);
    } catch (error) {
      setError("Failed to fetch jobs");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch saved jobs
  const fetchSavedJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3000/api/savedJobs`, { 
        headers: { Authorization: token } 
      });
      const jobIds = response.data.savedJobs.map(job => job._id);
      setSavedJobs(jobIds);
    } catch (error) {
      console.log(error);
    }
  };

  // Save/unsave job
  const handleSaveJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      const isSaved = savedJobs.includes(jobId);

      if (isSaved) {
        await axios.delete(`http://localhost:3000/api/job/unsaveJob/${jobId}`, { 
          headers: { Authorization: token } 
        });
        setSavedJobs(prev => prev.filter(id => id !== jobId));
        
        // Update user context
        const updatedUser = { ...user, savedJobs: user.savedJobs.filter(id => id !== jobId) };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        await axios.post(`http://localhost:3000/api/job/saveJob/${jobId}`, {}, { 
          headers: { Authorization: token } 
        });
        setSavedJobs(prev => [...prev, jobId]);
        
        // Update user context
        const updatedUser = { ...user, savedJobs: [...user.savedJobs, jobId] };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Apply for job
  const applyForJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`http://localhost:3000/api/job/applyJob/${jobId}`, {}, { 
        headers: { Authorization: token } 
      });

      // Update user context
      const updatedUser = { ...user, appliedJobs: [...user.appliedJobs, jobId] };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // Filtered jobs
  const filteredJobs = allJobs
    .filter(job => {
      const matchSearch = filters.search === '' || 
        job.title.toLowerCase().includes(filters.search.toLowerCase()) || 
        job.companyName.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchLocation = filters.location === 'All Locations' || 
        job.location.some(loc => loc.includes(filters.location));
      
      const matchType = filters.jobType === 'All Types' || job.jobType === filters.jobType;
      const matchSalary = filters.salary === 'Any Salary' || job.salary === filters.salary;
      const matchExperience = filters.experience === 'Any Experience' || job.experience === filters.experience;
      
      return matchSearch && matchLocation && matchType && matchSalary && matchExperience;
    })
    .sort((a, b) => {
      return filters.sortBy === 'Created at'
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.deadline) - new Date(b.deadline);
    });

  // Load data on mount
  useEffect(() => {
    fetchAllJobs();
    fetchSavedJobs();
  }, []);

  const value = {
    allJobs,
    savedJobs,
    filteredJobs,
    filters,
    loading,
    error,
    setFilters,
    fetchAllJobs,
    fetchSavedJobs,
    handleSaveJob,
    applyForJob,
    refetchJobs: fetchAllJobs
  };

  return (
    <JobsContext.Provider value={value}>
      {children}
    </JobsContext.Provider>
  );
};

export default JobsContext;