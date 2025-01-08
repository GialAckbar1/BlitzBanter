const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json()); // Parse JSON body
app.use(cors()); // Allow requests from frontend

// Signup Route
app.post("/signup", (req, res) => {
  const { email, password } = req.body;

  console.log("Received Data:", { email, password });

  // Dummy response (You can replace this with database logic)
  res.json({ message: "Signup successful!", user: { email } });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
