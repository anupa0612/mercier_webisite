import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Serve the website
const publicDir = path.join(__dirname, "..", "public");
app.use(express.static(publicDir));

// Orders file
const ordersPath = path.join(__dirname, "orders.json");

function readOrders() {
  try {
    const raw = fs.readFileSync(ordersPath, "utf-8");
    const data = JSON.parse(raw);
    if (!data.orders) data.orders = [];
    return data;
  } catch {
    return { orders: [] };
  }
}

function writeOrders(data) {
  fs.writeFileSync(ordersPath, JSON.stringify(data, null, 2), "utf-8");
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "mercier-store" });
});

// Place order
app.post("/api/orders", (req, res) => {
  const { customer, items, totals } = req.body || {};

  if (!customer?.fullName || !customer?.email || !customer?.address || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ ok: false, error: "Missing customer details or cart items." });
  }

  const order = {
    id: `MRC-${nanoid(10).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: "Received",
    customer,
    items,
    totals
  };

  const data = readOrders();
  data.orders.unshift(order);
  writeOrders(data);

  return res.json({ ok: true, orderId: order.id });
});

// List orders (simple admin key)
app.get("/api/orders", (req, res) => {
  const adminKey = req.query.key || "";
  // Change this key later to something secret
  const EXPECTED = "mercier-admin-123";

  if (adminKey !== EXPECTED) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  const data = readOrders();
  res.json({ ok: true, orders: data.orders });
});

// Serve pages nicely
app.get("*", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
  console.log(`Mercier Store running on http://localhost:${PORT}`);
});
