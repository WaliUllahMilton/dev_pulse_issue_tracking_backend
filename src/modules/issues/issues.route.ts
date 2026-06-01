import { Router } from "express";
import isValidUser from "../../middleware/auth";
import isMaintainer from "../../middleware/maintainer";
import { issuesController } from "./issues.controller";

const router = Router();

router.post("/", isValidUser, issuesController.createIssueController);
router.get("/", issuesController.getAllIssuesController);
router.get("/:id", issuesController.getSingleIssueController);
router.patch("/:id", isValidUser, issuesController.updateIssueController);
router.delete("/:id", isMaintainer, issuesController.deleteIssueController);

export const issuesRoute = router;
