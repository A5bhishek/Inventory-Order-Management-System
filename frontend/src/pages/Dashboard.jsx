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

  const totalRevenue =
    orders.reduce(
      (sum, order) =>
        sum + order.total_amount,
      0
    );

  const recentOrders =
    [...orders]
      .sort((a, b) => b.id - a.id)
      .slice(0, 5);

  return (

    <div className="container">

      <h1>
        Inventory Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "30px"
        }}
      >

        <div className="card">
          <h3>Total Products</h3>
          <h2>{products.length}</h2>
        </div>

        <div className="card">
          <h3>Total Customers</h3>
          <h2>{customers.length}</h2>
        </div>

        <div className="card">
          <h3>Total Orders</h3>
          <h2>{orders.length}</h2>
        </div>

        <div className="card">
          <h3>Total Revenue</h3>
          <h2>
            ₹{totalRevenue.toFixed(2)}
          </h2>
        </div>

      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "20px"
        }}
      >

        <div className="card">

          <h2>
            Inventory Alerts
          </h2>

          {lowStockProducts.length === 0 ? (

            <p>
              No low stock products
            </p>

          ) : (

            <ul>

              {lowStockProducts.map(
                (product) => (

                  <li
                    key={product.id}
                  >
                    {product.name}
                    {" - "}
                    {product.quantity}
                    left
                  </li>

                )
              )}

            </ul>

          )}

        </div>

        <div className="card">

          <h2>
            Recent Orders
          </h2>

          {recentOrders.length === 0 ? (

            <p>
              No orders yet
            </p>

          ) : (

            <ul>

              {recentOrders.map(
                (order) => (

                  <li
                    key={order.id}
                  >
                    Order #
                    {order.id}
                    {" - ₹"}
                    {order.total_amount}
                  </li>

                )
              )}

            </ul>

          )}

        </div>

      </div>

    </div>

  );
}

export default Dashboard;