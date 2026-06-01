import type { Request, Response } from "express";
import { sendErrorResponse, sendResponse } from "../../utils";
import { issueService } from "./issues.service";

const createIssueController = async (req: Request, res: Response) => {
  try {
    const { title, description, type } = req.body;
    const user = req.user;
    const createIssue = await issueService.createIsssuesInDB(
      title,
      description,
      type,
      user?.data.id,
    );

    sendResponse(
      res,
      201,
      true,
      "Issue created successfully",
      createIssue.rows[0],
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const getAllIssuesController = async (req: Request, res: Response) => {
  try {
    const { sort = "newest", type, status } = req.query;
    const issues = await issueService.getAllIssuesFromDB(
      sort as any,
      type as any,
      status as any,
    );
    sendResponse(res, 200, true, "Issues retrived successfully", issues.rows);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const getSingleIssueController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const issue = await issueService.getSingleIssueFromDB(Number(id as string));
    if (issue.rowCount) {
      sendResponse(
        res,
        200,
        true,
        "Issue retrived successfully",
        issue.rows[0],
      );
    } else {
      sendResponse(res, 404, false, "Issue not found!");
    }
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const updateIssueController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, type } = req.body;
    const getIssue = await issueService.getSingleIssueFromDB(Number(id));

    if (
      getIssue.rowCount &&
      (req.user?.data?.role === "maintainer" ||
        getIssue.rows[0]?.reporter?.id === req.user?.data?.id)
    ) {
      const updateIssue = await issueService.updateIssueInDB(
        Number(id),
        title,
        description,
        type,
      );
      sendResponse(
        res,
        200,
        true,
        "Issue updated successfully",
        updateIssue.rows[0],
      );
    } else {
      sendResponse(res, 403, false, "You don't have access!");
    }
    if (!getIssue) {
      sendResponse(res, 404, false, "Issue not found!");
    }
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const deleteIssueController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const isExistIssue = await issueService.getSingleIssueFromDB(Number(id));
    if (isExistIssue.rowCount) {
      await issueService.deleteIssueFromDB(Number(id));
      sendResponse(res, 200, true, "Issue deleted successfully");
    } else {
      sendResponse(res, 404, false, "Issue not found!");
    }
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
export const issuesController = {
  createIssueController,
  getAllIssuesController,
  getSingleIssueController,
  updateIssueController,
  deleteIssueController,
};
