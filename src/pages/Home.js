import React, { useState, useEffect } from "react";
import "./Home.css";

const Home = () => {
  const [customers, setCustomers] = useState([]);
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage, setCustomersPerPage] = useState(10); // Default items per page
  const API_BASE = "http://localhost:3000";

  // Simulate Admin Token
  useEffect(() => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBlbWFpbC5jb20iLCJpYXQiOjE3Mzc5OTcxOTIsImV4cCI6MTczODAwMDc5Mn0.IqukZX7X9eizLzUOXJ-n3XGwoSqw6qYqmYfP2cbw0gc";
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", "admin"); // Set role as admin for testing
  }, []);

  useEffect(() => {
    fetchCustomers();
    fetchCities();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_BASE}/Customer`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch customers");
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await fetch(`${API_BASE}/City`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch cities");
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const getCityName = (cityId) => {
    const city = cities.find((city) => city.id === cityId);
    return city ? city.name : "";
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const sortedAndFilteredCustomers = customers
    .filter((customer) =>
      `${customer.name} ${customer.surname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(
    sortedAndFilteredCustomers.length / customersPerPage
  );

  const currentCustomers = sortedAndFilteredCustomers.slice(
    (currentPage - 1) * customersPerPage,
    currentPage * customersPerPage
  );

  return (
    <div className="home-container">
      {/* Search & Sort Controls */}
      <div className="search-sort-controls">
        <input
          type="text"
          placeholder="Search by name or surname..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <select onChange={(e) => setSortField(e.target.value)}>
          <option value="id">Sort by ID</option>
          <option value="name">Sort by Name</option>
          <option value="surname">Sort by Surname</option>
        </select>
        <select onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <select onChange={(e) => setCustomersPerPage(Number(e.target.value))}>
          <option value="10">10 items per page</option>
          <option value="20">20 items per page</option>
          <option value="50">50 items per page</option>
        </select>
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Surname</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.surname}</td>
              <td>{getCityName(customer.cityId)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
