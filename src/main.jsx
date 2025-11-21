import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
// import { AuthProvider } from "./contexts/AuthContext.jsx";
// import Cart from "./pages/customer/Cart.jsx";
// import { CartProvider } from "./contexts/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
