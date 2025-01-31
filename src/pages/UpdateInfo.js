import React, { useState, useEffect } from "react";
import "./UpdateInfo.css";

const UpdateInfo = () => {
  const [formData, setFormData] = useState({
    id: "1734563494169", // User ID for identifying the user
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [updatedData, setUpdatedData] = useState(null);

  useEffect(() => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGVtYWlsLmNvbSIsInBhc3N3b3JkIjoiMTIzcXdlYXNkIiwiaWF0IjoxNzM4MzQ0MzU0LCJleHAiOjE3MzgzNDc5NTR9.oKSL8ZK9PCX0ej0A1NInZh5NHNfUsT666FfsyLITc_E";
    localStorage.setItem("token", token);
  }, []);

  // Fetch current user data for pre-filling the form
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/auth/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setFormData({
          id: data.id || "", // Add user ID here
          name: data.name || "",
          email: data.email || "",
          password: "", // Password remains empty for security reasons
        });
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        setErrorMessage("Failed to load user information.");
      }
    };

    fetchCurrentUser();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:3000/auth/update", {
        method: "POST", // Using POST as specified
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData), // Ensure ID and updated data are included
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update information");
      }

      const result = await response.json();

      // Update the form data with the new values
      setFormData({
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        password: "", // Clear the password for security
      });

      setUpdatedData(result.user); // Store updated data
      setSuccessMessage("Information updated successfully!");
      console.log("Updated User Info:", result);
    } catch (error) {
      setErrorMessage(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="update-info-container">
      <h1>Update Your Information</h1>
      <form onSubmit={handleSubmit} className="update-info-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your new name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your new email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your new password"
          />
        </div>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Information"}
        </button>
      </form>

      {updatedData && (
        <div className="updated-info-display" style={{ border: "1px solid black", padding: "10px", marginTop: "20px" }}>
          <h2>Updated Information</h2>
          <p><strong>Name:</strong> {updatedData.name}</p>
          <p><strong>Email:</strong> {updatedData.email}</p>
        </div>
      )}
    </div>
  );
};

export default UpdateInfo;
