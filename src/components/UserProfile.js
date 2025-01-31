import React, { useState, useEffect } from "react";
import { fetchUserByEmail } from "../api/userService";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const emailToSearch = "lara@gmail.com"; 
        const userData = await fetchUserByEmail(emailToSearch);
        setUser(userData);
      } catch (err) {
        setError("Error fetching user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>User Profile</h1>
      {user ? (
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>ID: {user.id}</p>
        </div>
      ) : (
        <p>No user found.</p>
      )}
    </div>
  );
}
