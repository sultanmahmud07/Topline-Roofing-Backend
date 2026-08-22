"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const gmail_controller_1 = require("./gmail.controller");
const router = (0, express_1.Router)();
// ADMIN ONLY: Gmail operations
router.get("/inbox", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), gmail_controller_1.GmailController.getInboxThreads);
router.get("/history", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), gmail_controller_1.GmailController.getEmailHistory);
router.post("/reply", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), gmail_controller_1.GmailController.sendReply);
exports.GmailRoutes = router;
