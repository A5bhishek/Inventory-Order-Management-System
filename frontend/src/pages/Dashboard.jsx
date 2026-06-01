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

      const productsRes =
        await api.get("/products");

      const customersRes =
        await api.get("/customers");

      const ordersRes =
        await api.get("/orders");

      setProducts(productsRes.data);
      setCustomers(customersRes.data);
      setOrders(ordersRes.data);

    } catch (error) {
      console.log(error);
    }
  };

  const lowStockProducts =
    products.filter(
      (product) => product.quantity < 5
    );

  return (
    <div style={{ padding: "20px" }}>

      <h1>Dashboard</h1>

      <h3>
        Total Products: {products.length}
      </h3>

      <h3>
        Total Customers: {customers.length}
      </h3>

      <h3>
        Total Orders: {orders.length}
      </h3>

      <hr />

      <h2>Low Stock Products</h2>

      {lowStockProducts.length === 0 ? (
        <p>No low stock products</p>
      ) : (
        <ul>

          {lowStockProducts.map((product) => (
            <li key={product.id}>
              {product.name} - Qty:
              {product.quantity}
            </li>
          ))}

        </ul>
      )}

    </div>
  );
}

export default Dashboard;