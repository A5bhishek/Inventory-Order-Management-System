import { useEffect, useState } from "react";
import api from "../services/api";

function Orders() {

  const [orders, setOrders] = useState([]);

  const [customers, setCustomers] = useState([]);

  const [products, setProducts] = useState([]);

  const [customerId, setCustomerId] = useState("");

  const [productId, setProductId] = useState("");

  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCustomers = async () => {
    const res = await api.get("/customers");
    setCustomers(res.data);
  };

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  const createOrder = async (e) => {

    e.preventDefault();

    try {

      await api.post("/orders", {
        customer_id: Number(customerId),
        items: [
          {
            product_id: Number(productId),
            quantity: Number(quantity)
          }
        ]
      });

      setCustomerId("");
      setProductId("");
      setQuantity("");

      fetchOrders();
      fetchProducts();

    } catch (error) {
      alert(error.response?.data?.detail);
    }
  };

  const deleteOrder = async (id) => {

    try {

      await api.delete(`/orders/${id}`);

      fetchOrders();
      fetchProducts();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">

      <h2>Orders</h2>

      <form onSubmit={createOrder}>

        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        >
          <option value="">
            Select Customer
          </option>

          {customers.map((customer) => (
            <option
              key={customer.id}
              value={customer.id}
            >
              {customer.name}
            </option>
          ))}
        </select>

        <br /><br />

        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        >
          <option value="">
            Select Product
          </option>

          {products.map((product) => (
            <option
              key={product.id}
              value={product.id}
            >
              {product.name}
            </option>
          ))}
        </select>

        <br /><br />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value)
          }
        />

        <br /><br />

        <button type="submit">
          Create Order
        </button>

      </form>

      <hr />

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>ID</th>
            <th>Customer ID</th>
            <th>Total Amount</th>
            <th>Items</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {orders.map((order) => (

            <tr key={order.id}>

              <td>{order.id}</td>

              <td>{order.customer_id}</td>

              <td>{order.total_amount}</td>

              <td>
                {order.items.length}
              </td>

              <td>

                <button
                  onClick={() =>
                    deleteOrder(order.id)
                  }
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default Orders;