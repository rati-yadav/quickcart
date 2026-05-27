import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const products = [
  {
    id: 1,
    title: "Toy Car",
    category: "Toys",
    price: 499,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    title: "Smart Watch",
    category: "Electronics",
    price: 1999,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    title: "Dress",
    category: "Fashion",
    price: 999,
    image: "https://via.placeholder.com/150",
  },
];

// Home products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Search products
app.get("/api/products/search", (req, res) => {
  const { q, category } = req.query;

  let filtered = products;

  if (q) {
    filtered = filtered.filter((p) =>
      p.title.toLowerCase().includes(q.toLowerCase())
    );
  }

  if (category) {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  res.json(filtered);
});

// Wishlist
app.get("/api/wishlist", (req, res) => {
  res.json([]);
});

app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});