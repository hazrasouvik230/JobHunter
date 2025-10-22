import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import currencyFormatter from '../../../CurrencyFormatter';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const Revenue = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/admin/transactions", { 
          headers: { Authorization: token } 
        });
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const prepareChartData = () => {
    if (!data) return {};

    const { transactions, summary } = data;

    const revenueByCompany = transactions.map(transaction => ({
      name: transaction.companyName,
      revenue: transaction.amount,
      plan: transaction.planName,
      date: new Date(transaction.purchaseDate).toLocaleDateString()
    }));

    const planDistribution = Object.entries(summary.planBreakdown || {}).map(([plan, count]) => ({
      name: plan,
      value: count,
      revenue: transactions
        .filter(t => t.planName === plan)
        .reduce((sum, t) => sum + t.amount, 0)
    })).filter(item => item.value > 0);

    const monthlyRevenue = [
      { month: 'Jan', revenue: 0 },
      { month: 'Feb', revenue: 0 },
      { month: 'Mar', revenue: 0 },
      { month: 'Apr', revenue: 0 },
      { month: 'May', revenue: 0 },
      { month: 'Jun', revenue: 0 },
      { month: 'Jul', revenue: 0 },
      { month: 'Aug', revenue: 0 },
      { month: 'Sep', revenue: 0 },
      { month: 'Oct', revenue: summary.totalRevenue },
      { month: 'Nov', revenue: 0 },
      { month: 'Dec', revenue: 0 },
    ];

    const subscriptionStatus = [
      { name: 'Active', value: summary.activeSubscriptions, color: '#00C49F' },
      { name: 'Expired', value: summary.expiredSubscriptions, color: '#FF8042' }
    ];

    return {
      revenueByCompany,
      planDistribution,
      monthlyRevenue,
      subscriptionStatus
    };
  };

  const chartData = prepareChartData();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="px-6 md:px-32 py-12 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading revenue data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='px-6 md:px-32 py-12 pb-20 bg-gray-50 min-h-screen'>
      <div className='text-center mb-8 mt-16 relative'>
        <div className="absolute left-0 top-0"><Link to="/" className="text-gray-600 hover:text-blue-800 hover:font-semibold transition-all">Back</Link></div>

        <p className='text-4xl text-shadow-lg font-bold text-gray-900 mb-4'>Revenue Analytics</p>
        <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Comprehensive overview of your revenue streams</p>
      </div>

      {/* Summary Cards */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-8 border-blue-500">
            <p className="text-lg text-gray-600 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-800">
              {currencyFormatter({ amount: data.summary.totalRevenue })}/-
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-8 border-purple-500">
            <p className="text-lg text-gray-600 font-medium">Active Subscriptions</p>
            <p className="text-2xl font-bold text-gray-800">{data.summary.activeSubscriptions}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-8 border-amber-500">
            <p className="text-lg text-gray-600 font-medium">Expired Subscriptions</p>
            <p className="text-2xl font-bold text-gray-800">{data.summary.expiredSubscriptions}</p>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue by Company */}
        <div className="bg-white border-2 border-gray-300 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Revenue by Company</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.revenueByCompany}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip 
                formatter={(value) => [currencyFormatter({ amount: value }), 'Revenue']}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#0088FE" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Plan Distribution */}
        {/* <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Plan Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.planDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.planDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => {
                  if (name === 'value') {
                    return [value, 'Subscriptions'];
                  }
                  return [currencyFormatter({ amount: props.payload.revenue }), 'Total Revenue'];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div> */}

        {/* Monthly Revenue Trend */}
        {/* <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [currencyFormatter({ amount: value }), 'Revenue']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#00C49F" 
                strokeWidth={2}
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </div> */}

        {/* Subscription Status */}
        <div className="bg-white border-2 border-gray-300 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Subscription Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.subscriptionStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.subscriptionStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      {data && data.transactions && (
        <div className="bg-white border-2 border-gray-300 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Transactions</h2>
          <div className="space-y-4">
            {data.transactions.map((transaction, index) => (
              <div
                key={transaction.transactionId}
                className="bg-blue-50 p-4 flex justify-between items-center rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <p className="font-semibold text-lg text-gray-800">{transaction.companyName}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Plan:</span> {transaction.planName}
                    </div>
                    <div>
                      <span className="font-medium">HR:</span> {transaction.hrName}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {new Date(transaction.purchaseDate).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">TXN ID:</span> {transaction.transactionId.slice(-8)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-bold text-xl">
                    {currencyFormatter({ amount: transaction.amount })}/-
                  </p>
                  <p className="text-sm text-gray-500">{transaction.currency}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Revenue;