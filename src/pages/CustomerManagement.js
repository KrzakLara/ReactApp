// LO2: Modules (import)
import React, { useState, useEffect } from "react";
import { Table, Button, InputGroup, Form, Dropdown } from "react-bootstrap";
import "./CustomerManagement.css";

// LO2: const and useState hooks
const CustomerManagement = () => {
  // LO2: Destructuring
  const [customers, setCustomers] = useState([]);
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage, setCustomersPerPage] = useState(10);
  const [paginationRange, setPaginationRange] = useState(5); // Dynamic pagination range

  const API_BASE = "http://localhost:3000";

  // LO2: Lifecycle Method (useEffect)
  useEffect(() => {
    const token = 
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGVtYWlsLmNvbSIsInBhc3N3b3JkIjoiMTIzcXdlYXNkIiwiaWF0IjoxNzM4MzUyMDI4LCJleHAiOjE3MzgzNTU2Mjh9.-ddITJF8Fk-JZ7RgrSJhuga58YxA9MG_Vn6aUXietFM";
    localStorage.setItem("token", token);

    fetchCustomers();
    fetchCities();
  }, []);

  // LO2: Arrow Functions (=>)
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

  const handleItemsPerPageChange = (value) => {
    setCustomersPerPage(Number(value));
    setCurrentPage(1); 
  };

  const handlePaginationRangeChange = (value) => {
    setPaginationRange(Number(value));
  };

  const sortedAndFilteredCustomers = customers
    .filter((customer) =>
      `${customer.name} ${customer.surname} ${customer.email} ${customer.telephone}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(sortedAndFilteredCustomers.length / customersPerPage);

  const currentCustomers = sortedAndFilteredCustomers.slice(
    (currentPage - 1) * customersPerPage,
    currentPage * customersPerPage
  );

  const getPageNumbers = () => {
    const start = Math.max(1, currentPage - Math.floor(paginationRange / 2));
    const end = Math.min(totalPages, start + paginationRange - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="customer-management container">
      <h1 className="text-center my-4">Customer Management</h1>

      <div className="mb-3 d-flex justify-content-between align-items-center">
        {/* Search Field */}
        <InputGroup className="w-50">
          <Form.Control
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        {/* Sorting Controls */}
        <div className="d-flex gap-3">
          <Form.Select value={sortField} onChange={(e) => setSortField(e.target.value)}>
            <option value="id">Sort by ID</option>
            <option value="name">Sort by Name</option>
            <option value="surname">Sort by Surname</option>
          </Form.Select>
          <Form.Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </Form.Select>
        </div>

        {/* Items per page dropdown */}
        <Dropdown>
          <Dropdown.Toggle variant="secondary">Items per page: {customersPerPage}</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleItemsPerPageChange(10)}>10</Dropdown.Item>
            <Dropdown.Item onClick={() => handleItemsPerPageChange(20)}>20</Dropdown.Item>
            <Dropdown.Item onClick={() => handleItemsPerPageChange(50)}>50</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* Pagination range dropdown */}
        <Dropdown>
          <Dropdown.Toggle variant="secondary">Pagination range: {paginationRange}</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handlePaginationRangeChange(3)}>3</Dropdown.Item>
            <Dropdown.Item onClick={() => handlePaginationRangeChange(5)}>5</Dropdown.Item>
            <Dropdown.Item onClick={() => handlePaginationRangeChange(10)}>10</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Customer Table */}
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Surname</th>
            <th>Email</th>
            <th>Telephone</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.surname}</td>
              <td>{customer.email}</td>
              <td>{customer.telephone || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} variant="outline-primary">
          Previous
        </Button>

        <div>
          {getPageNumbers().map((number) => (
            <Button key={number} onClick={() => setCurrentPage(number)} className={`mx-1 ${number === currentPage ? "active" : ""}`} variant="outline-secondary">
              {number}
            </Button>
          ))}
        </div>

        <Button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} variant="outline-primary">
          Next
        </Button>
      </div>
    </div>
  );
};

export default CustomerManagement;
