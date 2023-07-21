const express = require("express");
const testRoute = require("./routes/testRoutes.js");
const userRoute = require("./routes/authRoutes.js");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const colors = require("colors");
const connectDB = require("./config/db.js");
const path = require("path");

dotenv.config();

connectDB();

const app = express();

//middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/v1", testRoute);
app.use("/api/v1/auth", userRoute);
app.use("/api/v1/inventory", require("./routes/inventoryRoutes.js"));
app.use("/api/v1/analytics", require("./routes/analyticsRoutes.js"));
app.use("/api/v1/admin", require("./routes/adminRoutes.js"));

//static folder
app.use(express.static(path.join(__dirname, "./client/build")));

//static routes
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `Node Server running in ${process.env.DEV_MODE} on port ${PORT}`.bgBlue
      .white
  );
});
