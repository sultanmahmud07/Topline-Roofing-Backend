import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { StateController } from "./state.controller";
import { createStateSchema, updateStateSchema } from "./state.validation";

const router = Router();

// Public: clients fetching states
router.get("/", StateController.getAllStates);
router.get("/:id", StateController.getSingleState);

// Admin: managing states
router.post(
    "/create",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createStateSchema),
    StateController.createState
);

router.patch(
    "/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(updateStateSchema),
    StateController.updateState
);

router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), StateController.deleteState);

export const StateRoutes = router;
