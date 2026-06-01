import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        background: "#2563eb",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        gap: "24px",
      }}
    >
      <h2
        style={{
          color: "white",
          marginRight: "30px",
        }}
      >
        InventoryMS
      </h2>

      <Link
        style={{
          color: "white",
          textDecoration: "none",
          fontWeight: "500",
        }}
        to="/"
      >
        Dashboard
      </Link>

      <Link
        style={{
          color: "white",
          textDecoration: "none",
          fontWeight: "500",
        }}
        to="/products"
      >
        Products
      </Link>

      <Link
        style={{
          color: "white",
          textDecoration: "none",
          fontWeight: "500",
        }}
        to="/customers"
      >
        Customers
      </Link>

      <Link
        style={{
          color: "white",
          textDecoration: "none",
          fontWeight: "500",
        }}
        to="/orders"
      >
        Orders
      </Link>
    </nav>
  );
}

export default Navbar;