import { useEffect, useState } from "react";
import api from "../services/api";

function Orders() {

  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [customerId, setCustomerId] = useState("");

  const [items, setItems] = useState([
    {
      product_id: "",
      quantity: ""
    }
  ]);

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
    try {
      const res = await api.get("/customers");
      setCustomers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        product_id: "",
        quantity: ""
      }
    ]);
  };

  const removeItem = (index) => {

    const updatedItems =
      items.filter((_, i) => i !== index);

    setItems(updatedItems);
  };

  const updateItem = (
    index,
    field,
    value
  ) => {

    const updatedItems = [...items];

    updatedItems[index][field] = value;

    setItems(updatedItems);
  };

  const createOrder = async (e) => {

    e.preventDefault();

    try {

      await api.post("/orders", {
        customer_id: Number(customerId),

        items: items.map((item) => ({
          product_id: Number(
            item.product_id
          ),
          quantity: Number(
            item.quantity
          )
        }))
      });

      setCustomerId("");

      setItems([
        {
          product_id: "",
          quantity: ""
        }
      ]);

      fetchOrders();
      fetchProducts();

    } catch (error) {
      alert(
        error.response?.data?.detail ||
        "Failed to create order"
      );
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
          onChange={(e) =>
            setCustomerId(
              e.target.value
            )
          }
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

        <br />
        <br />

        {items.map((item, index) => (

          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px"
            }}
          >

            <select
              value={item.product_id}
              onChange={(e) =>
                updateItem(
                  index,
                  "product_id",
                  e.target.value
                )
              }
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

            <input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) =>
                updateItem(
                  index,
                  "quantity",
                  e.target.value
                )
              }
              style={{
                marginLeft: "10px"
              }}
            />

            {items.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  removeItem(index)
                }
                style={{
                  marginLeft: "10px"
                }}
              >
                Remove
              </button>
            )}

          </div>

        ))}

        <button
          type="button"
          onClick={addItem}
        >
          Add Product
        </button>

        <br />
        <br />

        <button type="submit">
          Create Order
        </button>

      </form>

      <hr />

      <table
        border="1"
        cellPadding="10"
      >

        <thead>

          <tr>
            <th>ID</th>
            <th>Customer ID</th>
            <th>Total Amount</th>
            <th>Products ordered</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          {orders.map((order) => (

            <tr key={order.id}>

              <td>{order.id}</td>

              <td>
                {order.customer_id}
              </td>

              <td>
                {order.total_amount}
              </td>

              <td>
              {order.items.map((item) => {

                const product = products.find(
                  (p) => p.id === item.product_id
                );

                return (
                  <div key={item.id}>
                    {product
                      ? product.name
                      : `Product ${item.product_id}`}
                    {" "}
                    × {item.quantity}
                  </div>
                );
              })}
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