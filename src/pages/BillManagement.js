import React, { useState, useEffect } from "react";
import "./BillManagement.css";

//LO1: react handles DOM updates automatically when the state change (useState)
const BillManagement = () => {
  const [bills, setBills] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [newBill, setNewBill] = useState({
    customerId: "",
    billNumber: "",
    total: "",
    date: "",
    comment: "",
  });
  const [editingBill, setEditingBill] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [billsPerPage, setBillsPerPage] = useState(10); // Items per page
  const paginationRange = 5;

  const API_BASE = "http://localhost:3000";

  useEffect(() => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGVtYWlsLmNvbSIsInBhc3N3b3JkIjoiMTIzcXdlYXNkIiwiaWF0IjoxNzM4MzUyMDI4LCJleHAiOjE3MzgzNTU2Mjh9.-ddITJF8Fk-JZ7RgrSJhuga58YxA9MG_Vn6aUXietFM";
    localStorage.setItem("token", token);
  }, []);

  useEffect(() => {
    fetchBills();
    fetchCustomers();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await fetch(`${API_BASE}/Bill`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch bills");
      const data = await response.json();
      setBills(data);
    } catch (error) {
      console.error("Error fetching bills:", error);
      alert(error.message);
    }
  };

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
      alert(error.message);
    }
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find((cust) => cust.id === customerId);
    return customer ? `${customer.name} ${customer.surname}` : "Unknown Customer";
  };

  const handleAddBill = async () => {
    if (!newBill.customerId || !newBill.billNumber || !newBill.total || !newBill.date) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/Bill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newBill),
      });

      if (response.ok) {
        setNewBill({ customerId: "", billNumber: "", total: "", date: "", comment: "" });
        fetchBills();
        alert("Bill added successfully!");
      } else {
        throw new Error("Failed to add bill");
      }
    } catch (error) {
      console.error("Error adding bill:", error);
      alert(error.message);
    }
  };

  const handleEditBill = (bill) => {
    setEditingBill({ ...bill });
  };

  const handleSaveBill = async () => {
    if (!editingBill.customerId || !editingBill.billNumber || !editingBill.total || !editingBill.date) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/Bill/${editingBill.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editingBill),
      });

      if (response.ok) {
        setEditingBill(null);
        fetchBills();
        alert("Bill updated successfully!");
      } else {
        throw new Error("Failed to update bill");
      }
    } catch (error) {
      console.error("Error updating bill:", error);
      alert(error.message);
    }
  };

  const handleDeleteBill = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/Bill/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        fetchBills();
        alert("Bill deleted successfully!");
      } else {
        throw new Error("Failed to delete bill");
      }
    } catch (error) {
      console.error("Error deleting bill:", error);
      alert(error.message);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setBillsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  const filteredAndSortedBills = bills
    .filter((bill) => {
      const customerName = getCustomerName(bill.customerId).toLowerCase();
      return (
        customerName.includes(searchTerm.toLowerCase()) ||
        bill.billNumber.toLowerCase().includes(searchTerm) ||
        bill.comment.toLowerCase().includes(searchTerm)
      );
    })
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredAndSortedBills.length / billsPerPage);

  const currentBills = filteredAndSortedBills.slice(
    (currentPage - 1) * billsPerPage,
    currentPage * billsPerPage
  );

  const getPageNumbers = () => {
    const start = Math.max(1, currentPage - Math.floor(paginationRange / 2));
    const end = Math.min(totalPages, start + paginationRange - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="bill-management">
      <h1>Bill Management</h1>

      <div className="add-bill">
        <h2>Add New Bill</h2>
        <select
          value={newBill.customerId}
          onChange={(e) => setNewBill({ ...newBill, customerId: e.target.value })}
        >
          <option value="">Select Customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {getCustomerName(customer.id)}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Bill Number"
          value={newBill.billNumber}
          onChange={(e) => setNewBill({ ...newBill, billNumber: e.target.value })}
        />
        <input
          type="number"
          placeholder="Total"
          value={newBill.total}
          onChange={(e) => setNewBill({ ...newBill, total: e.target.value })}
        />
        <input
          type="date"
          value={newBill.date}
          onChange={(e) => setNewBill({ ...newBill, date: e.target.value })}
        />
        <textarea
          placeholder="Comment"
          value={newBill.comment}
          onChange={(e) => setNewBill({ ...newBill, comment: e.target.value })}
        />
        <button onClick={handleAddBill}>Add Bill</button>
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="Search bills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="sorting-controls">
          <select onChange={(e) => setSortField(e.target.value)}>
            <option value="id">Sort by ID</option>
            <option value="billNumber">Sort by Bill Number</option>
            <option value="total">Sort by Total</option>
            <option value="date">Sort by Date</option>
          </select>
          <select onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <div className="pagination-controls">
          <label>Items per page:</label>
          <select value={billsPerPage} onChange={handleItemsPerPageChange}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Bill ID</th>
            <th>Customer</th>
            <th>Bill Number</th>
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
              <td>{getCustomerName(bill.customerId)}</td>
              <td>
                {editingBill?.id === bill.id ? (
                  <input
                    type="text"
                    value={editingBill.billNumber}
                    onChange={(e) => setEditingBill({ ...editingBill, billNumber: e.target.value })}
                  />
                ) : (
                  bill.billNumber
                )}
              </td>
              <td>
                {editingBill?.id === bill.id ? (
                  <input
                    type="number"
                    value={editingBill.total}
                    onChange={(e) => setEditingBill({ ...editingBill, total: e.target.value })}
                  />
                ) : (
                  bill.total
                )}
              </td>
              <td>
                {editingBill?.id === bill.id ? (
                  <input
                    type="date"
                    value={editingBill.date}
                    onChange={(e) => setEditingBill({ ...editingBill, date: e.target.value })}
                  />
                ) : (
                  bill.date
                )}
              </td>
              <td>
                {editingBill?.id === bill.id ? (
                  <textarea
                    value={editingBill.comment}
                    onChange={(e) => setEditingBill({ ...editingBill, comment: e.target.value })}
                  />
                ) : (
                  bill.comment
                )}
              </td>
              <td>
                {editingBill?.id === bill.id ? (
                  <>
                    <button onClick={handleSaveBill}>Save</button>
                    <button onClick={() => setEditingBill(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditBill(bill)}>Edit</button>
                    <button onClick={() => handleDeleteBill(bill.id)}>Delete</button>
                  </>
                )}
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
    </div>
  );
};

export default BillManagement;
