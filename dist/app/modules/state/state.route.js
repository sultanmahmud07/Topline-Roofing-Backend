"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_interface_1 = require("../user/user.interface");
const state_controller_1 = require("./state.controller");
const state_validation_1 = require("./state.validation");
const router = (0, express_1.Router)();
// Public: clients fetching states
router.get("/", state_controller_1.StateController.getAllStates);
router.get("/:id", state_controller_1.StateController.getSingleState);
// Admin: managing states
router.post("/create", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(state_validation_1.createStateSchema), state_controller_1.StateController.createState);
router.patch("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(state_validation_1.updateStateSchema), state_controller_1.StateController.updateState);
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), state_controller_1.StateController.deleteState);
exports.StateRoutes = router;
