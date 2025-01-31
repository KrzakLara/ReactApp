
//LO$: axios: user-related API calls
import axios from "axios";

export const fetchUserByEmail = async (email) => {
  try {
    const response = await axios.get("http://localhost:3000/auth/user", {
      params: { email }, // Pass the email as a query parameter
    });
    console.log("User fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error.response || error.message);
    alert("Error fetching user");
    return null;
  }
};

export const fetchAllUsers = async () => {
  try {
    const response = await axios.get("http://localhost:3000/auth/users");
    console.log("All users fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error.response || error.message);
    alert("Error fetching users");
    return [];
  }
};
