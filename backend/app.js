const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const equipmentRoutes = require("./routes/equipment");
const maintenanceRoutes = require("./routes/maintenance");
const teamsRoutes = require("./routes/teams");
const usersRoutes = require("./routes/users");
const equipmentCategoriesRoutes = require("./routes/equipment-categories");
const maintenanceStatusRoutes = require("./routes/maintenance-status");
const workCentersRoutes = require("./routes/work-centers");
const companiesRoutes = require("./routes/companies");
const testRoutes = require("./routes/test");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/equipment", equipmentRoutes);
app.use("/maintenance", maintenanceRoutes);
app.use("/teams", teamsRoutes);
app.use("/users", usersRoutes);
app.use("/equipment-categories", equipmentCategoriesRoutes);
app.use("/maintenance-status", maintenanceStatusRoutes);
app.use("/work-centers", workCentersRoutes);
app.use("/companies", companiesRoutes);
app.use("/test", testRoutes);

module.exports = app;
