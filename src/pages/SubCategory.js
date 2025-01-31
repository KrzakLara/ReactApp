import React, { useState, useEffect } from "react";
import { Table, Button, Form, InputGroup } from "react-bootstrap";
import "./SubCategory.css";

const SubCategory = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [subCategoriesPerPage, setSubCategoriesPerPage] = useState(10); // Items per page

  useEffect(() => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGVtYWlsLmNvbSIsInBhc3N3b3JkIjoiMTIzcXdlYXNkIiwiaWF0IjoxNzM4MzUyMDI4LCJleHAiOjE3MzgzNTU2Mjh9.-ddITJF8Fk-JZ7RgrSJhuga58YxA9MG_Vn6aUXietFM";
    localStorage.setItem("token", token);
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/SubCategory", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch subcategories");
        }
        const data = await response.json();
        setSubCategories(data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };
    fetchSubCategories();
  }, []);

  // Items per page handler
  const handleItemsPerPageChange = (e) => {
    setSubCategoriesPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  // Sort subcategories
  const sortedSubCategories = subCategories
    .filter((subCategory) =>
      subCategory.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  // Pagination logic
  const totalPages = Math.ceil(sortedSubCategories.length / subCategoriesPerPage);
  const indexOfLastSubCategory = currentPage * subCategoriesPerPage;
  const indexOfFirstSubCategory = indexOfLastSubCategory - subCategoriesPerPage;
  const currentSubCategories = sortedSubCategories.slice(
    indexOfFirstSubCategory,
    indexOfLastSubCategory
  );

  const getPageNumbers = () => {
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="subcategory-container">
      <h1 className="text-center my-4">SubCategories</h1>

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <InputGroup className="w-50">
          <Form.Control
            type="text"
            placeholder="Search subcategories..."
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
              value={subCategoriesPerPage}
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
          {currentSubCategories.map((subCategory) => (
            <tr key={subCategory.id}>
              <td>{subCategory.id}</td>
              <td>{subCategory.name}</td>
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

export default SubCategory;
