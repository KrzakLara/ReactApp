import React, { useState, useEffect, useMemo } from "react";
import "./BillItemManagement.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileInvoice, faTimes, faUser, faReceipt } from "@fortawesome/free-solid-svg-icons";

const BillItemManagement = () => {
  const [bills, setBills] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [billDetails, setBillDetails] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [billsPerPage, setBillsPerPage] = useState(10);

  const API_BASE = "http://localhost:3000";

  useEffect(() => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGVtYWlsLmNvbSIsInBhc3N3b3JkIjoiMTIzcXdlYXNkIiwiaWF0IjoxNzM4MzUyMDI4LCJleHAiOjE3MzgzNTU2Mjh9.-ddITJF8Fk-JZ7RgrSJhuga58YxA9MG_Vn6aUXietFM";
    localStorage.setItem("token", token);
    fetchBills();
    fetchCustomers();
  }, []);

  const fetchBills = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const response = await fetch(`${API_BASE}/Bill`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bills");
      }

      const data = await response.json();
      setBills(data.map((bill) => ({ ...bill, total: parseFloat(bill.total) || 0 })));
    } catch (error) {
      console.error("Error fetching bills:", error);
      alert(error.message);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_BASE}/Customer`);

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      alert(error.message);
    }
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : "Unknown";
  };

  const memoizedCustomerName = useMemo(() => getCustomerName, [customers]);

  const handleItemsPerPageChange = (e) => {
    setBillsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  const totalPages = Math.ceil(bills.length / billsPerPage);

  const currentBills = bills.slice(
    (currentPage - 1) * billsPerPage,
    currentPage * billsPerPage
  );

  const openPopup = (bill) => {
    setBillDetails(bill);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setBillDetails(null);
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="bill-item-management">
      <h1>
        <FontAwesomeIcon icon={faFileInvoice} /> Bill Management
      </h1>

      <div className="controls">
        <label>Items per page:</label>
        <select value={billsPerPage} onChange={handleItemsPerPageChange}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Bill ID</th>
            <th>Customer ID</th>
            <th>Customer Name</th>
            <th>Total</th>
            <th>Date</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentBills.map((bill) => (
            <tr key={bill.id}>
              <td>{bill.id}</td>
              <td>{bill.customerId}</td>
              <td>
                <FontAwesomeIcon icon={faUser} /> {memoizedCustomerName(bill.customerId)}
              </td>
              <td>${bill.total.toFixed(2)}</td>
              <td>{new Date(bill.date).toLocaleDateString()}</td>
              <td>{bill.comment || "N/A"}</td>
              <td>
                <button onClick={() => openPopup(bill)}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {getPageNumbers().map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={number === currentPage ? "active" : ""}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {isPopupOpen && billDetails && (
        <div className="popup">
          <div className="popup-content">
            <button className="close-popup" onClick={closePopup}>
              <FontAwesomeIcon icon={faTimes} /> Close
            </button>
            <h2>Bill Details</h2>
            <table className="pink-table">
              <tbody>
                <tr>
                  <td><FontAwesomeIcon icon={faReceipt} /> <strong>Bill ID:</strong></td>
                  <td>{billDetails.id}</td>
                </tr>
                <tr>
                  <td><FontAwesomeIcon icon={faUser} /> <strong>Customer Name:</strong></td>
                  <td>{memoizedCustomerName(billDetails.customerId)}</td>
                </tr>
                <tr>
                  <td><strong>Total:</strong></td>
                  <td>${billDetails.total.toFixed(2)}</td>
                </tr>
                <tr>
                  <td><strong>Date:</strong></td>
                  <td>{new Date(billDetails.date).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td><strong>Comment:</strong></td>
                  <td>{billDetails.comment || "N/A"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillItemManagement;
