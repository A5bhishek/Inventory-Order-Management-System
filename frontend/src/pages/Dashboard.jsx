import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const productsRes = await api.get("/products");
      const customersRes = await api.get("/customers");
      const ordersRes = await api.get("/orders");

      setProducts(productsRes.data);
      setCustomers(customersRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  const lowStockProducts = products.filter(
    (product) => product.quantity < 5
  );

  const outOfStockProducts = products.filter(
    (product) => product.quantity === 0
  );

  const inStockProducts = products.filter(
    (product) => product.quantity > 0
  );

  return (
    <div className="container">
      <h1>Inventory Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Products</h3>
          <h2>{products.length}</h2>
        </div>

        <div className="stat-card">
          <h3>Total Customers</h3>
          <h2>{customers.length}</h2>
        </div>

        <div className="stat-card">
          <h3>Total Orders</h3>
          <h2>{orders.length}</h2>
        </div>
      </div>

      <div className="card">
        <h2>Inventory Status</h2>

        <p>
          <strong>In Stock Products:</strong>{" "}
          {inStockProducts.length}
        </p>

        <p>
          <strong>Out Of Stock Products:</strong>{" "}
          {outOfStockProducts.length}
        </p>

        <p>
          <strong>Low Stock Products:</strong>{" "}
          {lowStockProducts.length}
        </p>
      </div>

      <div className="card">
        <h2>Low Stock Products</h2>

        {lowStockProducts.length === 0 ? (
          <p>No low stock products</p>
        ) : (
          <ul>
            {lowStockProducts.map((product) => (
              <li key={product.id}>
                {product.name} - Qty: {product.quantity}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h2>System Summary</h2>

        <p>
          Currently managing{" "}
          <strong>{products.length}</strong> products.
        </p>

        <p>
          Registered{" "}
          <strong>{customers.length}</strong> customers.
        </p>

        <p>
          Processed{" "}
          <strong>{orders.length}</strong> orders.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;