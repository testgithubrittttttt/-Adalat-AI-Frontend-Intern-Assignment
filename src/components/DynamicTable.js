// Importing necessary dependencies
import React, { useState, useMemo } from "react";
import { CSVLink } from "react-csv";
import "tailwindcss/tailwind.css";

const sampleData = [
  { id: 1, status: "Success", email: "ken99@yahoo.com", amount: "$316.00" },
  { id: 2, status: "Success", email: "abe45@gmail.com", amount: "$242.00" },
  { id: 3, status: "Processing", email: "monserrat44@gmail.com", amount: "$837.00" },
  { id: 4, status: "Success", email: "silas22@gmail.com", amount: "$874.00" },
  { id: 5, status: "Failed", email: "julia56@gmail.com", amount: "$132.00" },
  { id: 6, status: "Processing", email: "james45@gmail.com", amount: "$560.00" },
  { id: 7, status: "Success", email: "claire88@gmail.com", amount: "$210.00" },
  { id: 8, status: "Failed", email: "daniel77@gmail.com", amount: "$480.00" },
  { id: 9, status: "Processing", email: "emily99@gmail.com", amount: "$390.00" },
  { id: 10, status: "Success", email: "robert12@gmail.com", amount: "$1000.00" },
];

const DynamicTable = () => {
  const [data] = useState(sampleData);
  const [filter, setFilter] = useState("");
  const [sortConfig, setSortConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [columnWidths, setColumnWidths] = useState({ status: 150, email: 300, amount: 150 });
  const rowsPerPage = 5;

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      Object.values(row).some((value) =>
        value
          .toString()
          .toLowerCase()
          .trim()
          .includes(filter.toLowerCase().trim())
      )
    );
  }, [data, filter]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, rowsPerPage]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleColumnResize = (key, delta) => {
    setColumnWidths((prevWidths) => ({
      ...prevWidths,
      [key]: Math.max(prevWidths[key] + delta, 50),
    }));
  };

  return (
    <div className="container mx-auto p-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white rounded-lg shadow-lg min-h-screen">
      {/* Animated Header */}
      <h1 className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse">
        Dynamic Table
      </h1>

      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 w-2/3 focus:outline-none focus:ring-4 focus:ring-blue-600"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-gray-800 text-white rounded-lg">
          <thead className="bg-gray-700">
            <tr>
              {Object.keys(columnWidths).map((key) => (
                <th
                  key={key}
                  style={{ width: columnWidths[key] }}
                  className="relative cursor-pointer px-4 py-2 text-left font-semibold text-gray-300 hover:text-white"
                >
                  <div className="flex items-center justify-between">
                    <span onClick={() => handleSort(key)}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                      {sortConfig?.key === key && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                    </span>
                    <div
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                      onMouseDown={(e) => {
                        const startX = e.clientX;
                        const handleMouseMove = (moveEvent) => {
                          const delta = moveEvent.clientX - startX;
                          handleColumnResize(key, delta);
                        };
                        const handleMouseUp = () => {
                          window.removeEventListener("mousemove", handleMouseMove);
                          window.removeEventListener("mouseup", handleMouseUp);
                        };
                        window.addEventListener("mousemove", handleMouseMove);
                        window.addEventListener("mouseup", handleMouseUp);
                      }}
                    ></div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr
                key={row.id}
                className={`transition-colors ${
                  index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                } hover:bg-gray-600`}
              >
                {Object.keys(columnWidths).map((key) => (
                  <td key={key} className="px-4 py-2">
                    {row[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-between items-center">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-transform transform hover:scale-105"
        >
          Previous
        </button>
        <span className="text-sm text-gray-400">
          Page {currentPage} of {Math.ceil(sortedData.length / rowsPerPage)}
        </span>
        <button
          disabled={currentPage === Math.ceil(sortedData.length / rowsPerPage)}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-transform transform hover:scale-105"
        >
          Next
        </button>
      </div>

      {/* CSV Export */}
      <div className="mt-6 flex justify-center">
        <CSVLink
          data={data}
          filename="table_data.csv"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-transform transform hover:scale-105"
        >
          Export CSV
        </CSVLink>
      </div>
    </div>
  );
};

export default DynamicTable;
