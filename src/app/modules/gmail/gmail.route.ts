import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { GmailController } from "./gmail.controller";

const router = Router();

// ADMIN ONLY: Gmail operations
router.get(
    "/inbox",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    GmailController.getInboxThreads
);

router.get(
    "/history",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    GmailController.getEmailHistory
);

router.post(
    "/reply",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    GmailController.sendReply
);

export const GmailRoutes = router;
