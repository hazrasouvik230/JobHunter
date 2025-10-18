import React, { useEffect, useState } from 'react'
import { FaUsers } from "react-icons/fa";
import { PiBuildingsFill } from "react-icons/pi";
import { FaSackDollar } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import axios from 'axios';

// Chart components (you'll need to install these libraries)
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [revenue, setRevenue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState({
        userGrowth: [],
        revenueByCompany: [],
        companyDistribution: []
    });

    // Colors for charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                
                // Fetch all data in parallel
                const [usersResponse, companiesResponse, revenueResponse] = await Promise.all([
                    axios.get("http://localhost:3000/api/list"),
                    axios.get("http://localhost:3000/api/admin/companies", { 
                        headers: { Authorization: token } 
                    }),
                    axios.get("http://localhost:3000/api/admin/transactions", { 
                        headers: { Authorization: token } 
                    })
                ]);

                setUsers(usersResponse.data.users || []);
                setCompanies(companiesResponse.data.companies || []);
                setRevenue(revenueResponse.data.summary?.totalRevenue || 0);

                // Prepare chart data
                prepareChartData(
                    usersResponse.data.users || [],
                    companiesResponse.data.companies || [],
                    revenueResponse.data.summary || {}
                );

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const prepareChartData = (users, companies, revenueData) => {
        // User growth data (last 6 months example)
        const userGrowthData = [
            { month: 'Jan', users: 45 },
            { month: 'Feb', users: 52 },
            { month: 'Mar', users: 48 },
            { month: 'Apr', users: 78 },
            { month: 'May', users: 65 },
            { month: 'Jun', users: users.length }
        ];

        // Revenue by company (example data - replace with actual)
        const revenueByCompany = companies.slice(0, 5).map((company, index) => ({
            name: company.name?.substring(0, 10) + '...' || `Company ${index + 1}`,
            revenue: Math.floor(Math.random() * 10000) + 1000
        }));

        // Company distribution by type (example)
        const companyDistribution = [
            { name: 'Tech', value: 40 },
            { name: 'Finance', value: 25 },
            { name: 'Healthcare', value: 20 },
            { name: 'Other', value: 15 }
        ];

        setChartData({
            userGrowth: userGrowthData,
            revenueByCompany,
            companyDistribution
        });
    };

    const info = [
        { 
            label: "Enrolled users", 
            icon: FaUsers, 
            counts: users.length,
            color: "bg-blue-200/50",
            textColor: "text-blue-700"
        },
        { 
            label: "Enrolled companies", 
            icon: PiBuildingsFill, 
            counts: companies.length,
            color: "bg-green-200/50",
            textColor: "text-green-700"
        },
        { 
            label: "Revenue generated", 
            icon: FaSackDollar, 
            counts: `$${revenue.toLocaleString()}`,
            color: "bg-amber-200/50",
            textColor: "text-amber-700"
        },
    ];

    if (loading) {
        return (
            <div className="px-6 md:px-32 py-12 pb-20 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='px-6 md:px-32 py-12 pb-20 bg-gray-50 min-h-screen'>
            <div className='text-center mb-8 mt-16'>
                <div className="absolute left-6 md:left-32"><Link to="/user/all-jobs" className="text-start hover:text-blue-800 cursor-pointer ease-in-out text-gray-600 hover:font-semibold">Back</Link></div>

                <p className='text-4xl font-bold text-shadow-lg text-gray-900 mb-4'>Admin Dashboard</p>
                <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Manage and monitor your platform</p>
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 my-8'>
                {info.map((ele) => (
                    <div key={ele.label} className={`${ele.color} flex items-center w-full px-6 py-6 gap-4 rounded-lg shadow-lg transition-transform hover:scale-105`}>
                        <ele.icon className={`text-4xl p-3 border rounded-full ${ele.textColor}`} />
                        <div>
                            <p className='text-3xl font-bold'>{ele.counts}</p>
                            <p className='text-sm font-medium text-gray-600'>{ele.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 my-8'>
                {/* User Growth Chart */}
                <div className='bg-white p-6 rounded-lg shadow-lg'>
                    <h3 className='text-xl font-bold mb-4 text-gray-800'>User Growth</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData.userGrowth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="users" stroke="#0088FE" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue by Company */}
                <div className='bg-white p-6 rounded-lg shadow-lg'>
                    <h3 className='text-xl font-bold mb-4 text-gray-800'>Revenue by Company (Top 5)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData.revenueByCompany}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                            <Legend />
                            <Bar dataKey="revenue" fill="#00C49F" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Company Distribution */}
                <div className='bg-white p-6 rounded-lg shadow-lg'>
                    <h3 className='text-xl font-bold mb-4 text-gray-800'>Company Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={chartData.companyDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {chartData.companyDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Activity */}
                <div className='bg-white p-6 rounded-lg shadow-lg'>
                    <h3 className='text-xl font-bold mb-4 text-gray-800'>Recent Activity</h3>
                    <div className="space-y-3">
                        {companies.slice(0, 4).map((company, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <div className="flex items-center">
                                    <PiBuildingsFill className="text-gray-500 mr-3" />
                                    <span className="font-medium">{company.name || `Company ${index + 1}`}</span>
                                </div>
                                <span className="text-sm text-gray-500">Recently joined</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard