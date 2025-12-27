const express = require("express");
const router = express.Router();
const equipmentModel = require("../models/equipment");

router.get("/", async (req, res) => {
  try {
    const equipment = await equipmentModel.getAllEquipment();
    res.json(equipment);
  } catch (error) {
    console.error("Get equipment error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
    });
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      name,
      serial_number,
      category_id,
      work_center_id,
      employee_id,
      department,
      technician_id,
      company_id,
      maintenance_team_id,
      assigned_date,
      scrap_date,
      used_in_location,
      description,
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Equipment name is required" });
    }

    const equipmentId = await equipmentModel.createEquipment({
      name,
      serial_number,
      category_id,
      work_center_id,
      employee_id,
      department,
      technician_id,
      company_id,
      maintenance_team_id,
      assigned_date,
      scrap_date,
      used_in_location,
      description,
    });

    res
      .status(201)
      .json({ message: "Equipment created successfully", id: equipmentId });
  } catch (error) {
    console.error("Create equipment error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const equipment = await equipmentModel.getEquipmentById(id);

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    res.json(equipment);
  } catch (error) {
    console.error("Get equipment by id error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
