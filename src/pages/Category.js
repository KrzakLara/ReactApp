// Category.js
import React, { useState, useEffect } from "react";
//LO4: React bootstrap:
//Form.Select: For dropdown selection (sorting and pagination controls).
//InputGroup and Form.Control: For search input styling.
//Table: For displaying categories.
//Button: For pagination navigation.
import { Table, Button, Form, InputGroup } from "react-bootstrap";
import "./Category.css";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage, setCategoriesPerPage] = useState(10); // Default items per page

  useEffect(() => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGVtYWlsLmNvbSIsInBhc3N3b3JkIjoiMTIzcXdlYXNkIiwiaWF0IjoxNzM4MzUyMDI4LCJleHAiOjE3MzgzNTU2Mjh9.-ddITJF8Fk-JZ7RgrSJhuga58YxA9MG_Vn6aUXietFM";
    localStorage.setItem("token", token);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/Category", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Items per page handler
  const handleItemsPerPageChange = (e) => {
    setCategoriesPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  // Sort categories
  const sortedCategories = categories
    .filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  // Pagination logic
  const totalPages = Math.ceil(sortedCategories.length / categoriesPerPage);
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = sortedCategories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  const getPageNumbers = () => {
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="category-container">
      <h1 className="text-center my-4">Categories</h1>

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <InputGroup className="w-50">
          <Form.Control
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <div className="d-flex gap-3">
          <Form.Select
            onChange={(e) => setSortField(e.target.value)}
            aria-label="Sort Field"
          >
            <option value="id">Sort by ID</option>
            <option value="name">Sort by Name</option>
          </Form.Select>
          <Form.Select
            onChange={(e) => setSortOrder(e.target.value)}
            aria-label="Sort Order"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </Form.Select>
          <div className="pagination-controls">
            <label>Items per page:</label>
            <Form.Select
              value={categoriesPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </Form.Select>
          </div>
        </div>
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {currentCategories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          variant="outline-primary"
        >
          Previous
        </Button>

        <div>
          {getPageNumbers().map((number) => (
            <Button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`mx-1 ${number === currentPage ? "active" : ""}`}
              variant="outline-secondary"
            >
              {number}
            </Button>
          ))}
        </div>

        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          variant="outline-primary"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Category;
