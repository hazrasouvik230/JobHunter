import React from "react";
import { FaSearch } from "react-icons/fa";

const FilterBar = () => {
  return (
    <div className="w-full bg-white p-3 flex flex-wrap items-center gap-3 border-b border-gray-200">
      {/* Dropdown Filters */}
      <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500">
        <option>All Sectors</option>
        <option>IT</option>
        <option>Finance</option>
        <option>Healthcare</option>
      </select>

      <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500">
        <option>All</option>
        <option>Full-Time</option>
        <option>Part-Time</option>
        <option>Internship</option>
      </select>

      {/* Clear Filters */}
      <button className="text-sm text-purple-600 hover:underline">
        Clear all filters
      </button>

      {/* Search Input */}
      <div className="relative ml-auto w-[280px] md:w-[350px]">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by job title or company"
          className="w-full pl-10 pr-4 py-2 text-sm rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

    </div>
  );
};

export default FilterBar;
