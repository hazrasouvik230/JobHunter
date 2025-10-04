// import React from 'react'
// import MyChart from '../../../MyChart';

// const Revenue = () => {
//   const recentlyCredit = [
//     {
//       companyId: "CMP001",
//       companyName: "TechNova Inc.",
//       creditedAmount: 5000,
//       date: "2025-09-14T10:15:00Z",
//       transactionId: "TXN123456",
//       creditedBy: "TechNova Admin"
//     },
//     {
//       companyId: "CMP002",
//       companyName: "HealthBridge Ltd.",
//       creditedAmount: 3000,
//       date: "2025-09-13T14:30:00Z",
//       transactionId: "TXN123457",
//       creditedBy: "Finance Manager"
//     },
//     {
//       companyId: "CMP003",
//       companyName: "EduPro Systems",
//       creditedAmount: 4500,
//       date: "2025-09-12T09:45:00Z",
//       transactionId: "TXN123458",
//       creditedBy: "EduPro HR"
//     },
//     {
//       companyId: "CMP004",
//       companyName: "GreenTech Solutions",
//       creditedAmount: 7000,
//       date: "2025-09-11T16:20:00Z",
//       transactionId: "TXN123459",
//       creditedBy: "GreenTech CFO"
//     },
//     {
//       companyId: "CMP005",
//       companyName: "BuildRight Corp.",
//       creditedAmount: 6000,
//       date: "2025-09-10T11:10:00Z",
//       transactionId: "TXN123460",
//       creditedBy: "BuildRight Admin"
//     }
//   ];

//   const totalRevenue = recentlyCredit.reduce((acc, cv) => {
//     return acc + cv.creditedAmount;
//   }, 0);

//   return (
//     <div className='px-32 py-16'>
//       <p className='text-3xl font-medium text-shadow-md pb-8'>Revenue</p>

//       <p>Total revenue generated: ₹{totalRevenue}</p>
//       <p>Monthly growth: 18%</p>
//       <p>Active job post: 50</p>
//       <p>Placed candidate: 20</p>

//       <div className='border'>
//         <p>Chart section</p>
//         <MyChart />
//       </div>


//       <div className='border'>
//         <p>recently add money</p>
//         <div className='flex flex-col gap-2 p-4'>
//           {
//             recentlyCredit.map(data => {
//               return <div key={data.companyId} className='bg-blue-300/20 p-2 flex items-center justify-between rounded-md shadow-md'>
//                 <p>{data.companyName}</p>
//                 <p>{new Date(data.date).toLocaleString()}</p>
//                 <p>{data.transactionId}</p>
//                 <p>{data.creditedBy}</p>
//                 <p className='text-green-600 font-bold text-lg'>₹{data.creditedAmount}</p>
//               </div>
//             })
//           }
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Revenue



























import React from 'react';
import MyChart from '../../../MyChart'; // Make sure this matches the actual export

const Revenue = () => {
  const recentlyCredit = [
    {
      companyId: "CMP001",
      companyName: "TechNova Inc.",
      creditedAmount: 5000,
      date: "2025-09-14T10:15:00Z",
      transactionId: "TXN123456",
      creditedBy: "TechNova Admin"
    },
    {
      companyId: "CMP002",
      companyName: "HealthBridge Ltd.",
      creditedAmount: 3000,
      date: "2025-09-13T14:30:00Z",
      transactionId: "TXN123457",
      creditedBy: "Finance Manager"
    },
    {
      companyId: "CMP003",
      companyName: "EduPro Systems",
      creditedAmount: 4500,
      date: "2025-09-12T09:45:00Z",
      transactionId: "TXN123458",
      creditedBy: "EduPro HR"
    },
    {
      companyId: "CMP004",
      companyName: "GreenTech Solutions",
      creditedAmount: 7000,
      date: "2025-09-11T16:20:00Z",
      transactionId: "TXN123459",
      creditedBy: "GreenTech CFO"
    },
    {
      companyId: "CMP005",
      companyName: "BuildRight Corp.",
      creditedAmount: 6000,
      date: "2025-09-10T11:10:00Z",
      transactionId: "TXN123460",
      creditedBy: "BuildRight Admin"
    }
  ];

  const totalRevenue = recentlyCredit.reduce((acc, cv) => acc + cv.creditedAmount, 0);

  return (
    <div className="px-32 py-16 space-y-8">
      <h1 className="text-3xl font-semibold mt-24">Revenue Dashboard</h1>

      <div className="space-y-2">
        <p><strong>Total Revenue Generated:</strong> ₹{totalRevenue}</p>
        <p><strong>Monthly Growth:</strong> 18%</p>
        <p><strong>Active Job Posts:</strong> 50</p>
        <p><strong>Placed Candidates:</strong> 20</p>
      </div>

      <div className="border rounded-md p-4 shadow-md bg-white">
        <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
        <MyChart />
      </div>

      <div className="border rounded-md p-4 shadow-md bg-white">
        <h2 className="text-xl font-semibold mb-4">Recent Credits</h2>
        <div className="flex flex-col gap-3">
          {recentlyCredit.map(data => (
            <div
              key={data.companyId}
              className="bg-blue-100 p-4 flex justify-between items-center rounded-md shadow-sm"
            >
              <div className="flex flex-col">
                <p className="font-medium">{data.companyName}</p>
                <p className="text-sm text-gray-600">{new Date(data.date).toLocaleString()}</p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-sm">TXN: {data.transactionId}</p>
                <p className="text-sm">By: {data.creditedBy}</p>
                <p className="text-green-600 font-bold text-lg">₹{data.creditedAmount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Revenue;
