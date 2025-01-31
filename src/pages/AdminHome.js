import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminHome.css";

const AdminHome = () => {
  const [customers, setCustomers] = useState([]);
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerResponse = await fetch("http://localhost:3000/Customer");
        const cityResponse = await fetch("http://localhost:3000/City");

        if (!customerResponse.ok || !cityResponse.ok) {
          throw new Error("Error fetching data.");
        }

        const customerData = await customerResponse.json();
        const cityData = await cityResponse.json();

        setCustomers(customerData);
        setCities(cityData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCityName = (cityId) => {
    const city = cities.find((c) => c.id === cityId);
    return city ? city.name : "N/A";
  };

  const handleSortChange = (e) => {
    setSortField(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const sortedCustomers = [...customers]
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = sortedCustomers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="admin-container">
      {/* Navigation Toolbar */}
      <div className="admin-toolbar">
        <button onClick={() => navigate("/admin-home")} className="nav-button">
          Dashboard
        </button>
        <button onClick={() => navigate("/customer-management")} className="nav-button">
          Customer Management
        </button>
        <button onClick={() => navigate("/bill-management")} className="nav-button">
          Bill Management
        </button>
        <button onClick={() => navigate("/bill-item-management")} className="nav-button">
          Bill Item Management
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("token"); // Log out and clear token
            navigate("/login");
          }}
          className="nav-button"
        >
          Log Out
        </button>
      </div>

      {/* Dashboard Section */}
      <h1>Customers</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <>
          <div className="search-and-sort">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <div className="sorting-container">
              <select onChange={handleSortChange} className="sort-dropdown">
                <option value="id">Sort by ID</option>
                <option value="name">Sort by Name</option>
                <option value="surname">Sort by Surname</option>
                <option value="email">Sort by Email</option>
                <option value="telephone">Sort by Telephone</option>
                <option value="cityId">Sort by City</option>
              </select>
              <select onChange={handleSortOrderChange} className="sort-dropdown">
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Surname</th>
                <th>Email</th>
                <th>Telephone</th>
                <th>City</th>
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
                  <td>{getCityName(customer.cityId)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            {Array.from({ length: Math.ceil(sortedCustomers.length / itemsPerPage) }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? "active-page" : ""}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminHome;
