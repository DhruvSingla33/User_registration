require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { sequelize, createDatabaseIfNotExists } = require("./db");
const AuthRoutes = require("./routes/Auth");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api", AuthRoutes);

const PORT = process.env.PORT || 5000;

(async () => {
  await createDatabaseIfNotExists();

  await sequelize.sync({ force: true })
    .then(() => console.log("✅ Tables synced."))
    .catch((err) => console.error("❌ Sync error:", err));

  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})();
