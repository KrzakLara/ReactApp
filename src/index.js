import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
//LO4: BrowserRouter components from react-router-dom confirm React Router usage
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux"; // Import Redux Provider
import { store } from "./store"; 
//LO3: SPA Application Evidence: React Router for Navigation
//Wrapping the application in <BrowserRouter> ensures that React Router
//  handles navigation within the app dynamically
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
