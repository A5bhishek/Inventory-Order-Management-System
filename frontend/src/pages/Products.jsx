import { useEffect, useState } from "react";
import api from "../services/api";

function Products() {

  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    quantity: ""
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await api.post("/products", {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity)
      });

      setFormData({
        name: "",
        sku: "",
        price: "",
        quantity: ""
      });

      fetchProducts();

    } catch (error) {
      console.log(error);
      alert(error.response?.data?.detail);
    }
  };

  const deleteProduct = async (id) => {

    try {

      await api.delete(`/products/${id}`);

      fetchProducts();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2>Products</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="sku"
          placeholder="SKU"
          value={formData.sku}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">
          Add Product
        </button>

      </form>

      <hr />

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {products.map((product) => (

            <tr key={product.id}>

              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.sku}</td>
              <td>{product.price}</td>
              <td>{product.quantity}</td>

              <td>

                <button
                  onClick={() =>
                    deleteProduct(product.id)
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

export default Products;