import React, { useState, useEffect } from "react";
import { Table, Button, Dropdown, Form } from "react-bootstrap";
import "./CreditCard.css";

const CreditCard = () => {
  const [creditCards, setCreditCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const visiblePages = 5; // Number of visible pages in pagination

  useEffect(() => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGVtYWlsLmNvbSIsInBhc3N3b3JkIjoiMTIzcXdlYXNkIiwiaWF0IjoxNzM4MzUyMDI4LCJleHAiOjE3MzgzNTU2Mjh9.-ddITJF8Fk-JZ7RgrSJhuga58YxA9MG_Vn6aUXietFM";
    localStorage.setItem("token", token);
  }, []);

  useEffect(() => {
    const fetchCreditCards = async () => {
      try {
        const response = await fetch("http://localhost:3000/CreditCard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch credit cards");
        }

        const data = await response.json();
        setCreditCards(data);
      } catch (error) {
        console.error("Error fetching credit cards:", error);
        alert("Error fetching credit cards. Please try again later.");
      }
    };

    fetchCreditCards();
  }, []);

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to the first page
  };

  const filteredAndSortedCards = creditCards
    .filter((card) =>
      `${card.type} ${card.cardNumber}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredAndSortedCards.length / itemsPerPage);

  const currentCards = filteredAndSortedCards.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPageNumbers = () => {
    const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  return (
    <div className="credit-card-container">
      <h1 className="text-center my-4">Credit Cards</h1>

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <Form.Control
          type="text"
          placeholder="Search cards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-50"
        />

        <div className="d-flex gap-3">
          <Dropdown>
            <Dropdown.Toggle variant="secondary">Sort by</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleSort("id")}>
                ID ({sortOrder === "asc" ? "Ascending" : "Descending"})
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSort("type")}>
                Type ({sortOrder === "asc" ? "Ascending" : "Descending"})
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSort("expirationYear")}>
                Expiration Year ({sortOrder === "asc" ? "Ascending" : "Descending"})
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Toggle variant="secondary">
              Items per page: {itemsPerPage}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleItemsPerPageChange(10)}>
                10
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleItemsPerPageChange(20)}>
                20
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleItemsPerPageChange(50)}>
                50
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {currentCards.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Card Number</th>
              <th>Expiration Month</th>
              <th>Expiration Year</th>
            </tr>
          </thead>
          <tbody>
            {currentCards.map((card) => (
              <tr key={card.id}>
                <td>{card.id}</td>
                <td>{card.type}</td>
                <td>{card.cardNumber}</td>
                <td>{card.expirationMonth}</td>
                <td>{card.expirationYear}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-center">No credit cards available.</p>
      )}

      <div className="d-flex justify-content-center mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          variant="outline-primary"
          className="me-2"
        >
          Previous
        </Button>
        {getPageNumbers().map((number) => (
          <Button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`mx-1 ${currentPage === number ? "active" : ""}`}
            variant="outline-secondary"
          >
            {number}
          </Button>
        ))}
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          variant="outline-primary"
          className="ms-2"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default CreditCard;
