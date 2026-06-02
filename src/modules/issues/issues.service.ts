import { pool } from "../../db";

const createIsssuesInDB = async (
  title: string,
  description: string,
  type: string,
  reporter_id: number,
) => {
  const issue = await pool.query(
    `INSERT INTO issues(title,description,type,reporter_id) 
    VALUES($1,$2,$3,$4)
    RETURNING * `,
    [title, description, type, reporter_id],
  );
  return issue;
};
const getAllIssuesFromDB = async (
  sort: "newest" | "oldest",
  type: "bug" | "feature_request",
  status: "open" | "in_progress" | "resolved",
) => {
  let query = ` SELECT i.id, i.title, i.description, i.type, i.status,
                json_build_object(
                'id', u.id,
                'name', u.name,
                'role', u.role
                ) AS reporter,
                i.created_at, 
                i.updated_at
                FROM issues i`;
  if (type && status) {
    query += ` WHERE i.type = '${type}' AND status = '${status}'`;
  } else if (type) {
    query += ` WHERE i.type = '${type}'`;
  } else if (status) {
    query += ` WHERE i.status = '${status}'`;
  }
  query += ` JOIN users u ON u.id = i.reporter_id ORDER BY i.created_at ${sort === "oldest" ? "ASC" : "DESC"}`;

  const issues = pool.query(query);
  return issues;
};

const getSingleIssueFromDB = async (id: number) => {
  const issue = pool.query(
    `
  SELECT
    i.id,
    i.title,
    i.description,
    i.type,
    i.status,
    json_build_object(
      'id', u.id,
      'name', u.name,
      'role', u.role
    ) AS reporter,
    i.created_at,
    i.updated_at
  FROM issues i
  JOIN users u ON u.id = i.reporter_id
  WHERE i.id = $1
`,
    [id],
  );
  return issue;
};
const updateIssueInDB = (
  id: number,
  title: string,
  description: string,
  type: "bug" | "feature_request",
) => {
  const updateIssue = pool.query(
    `UPDATE issues SET title = COALESCE($1,title), description = COALESCE($2,description), type = COALESCE($3,type),updated_at = $4 WHERE id =$5 RETURNING *`,
    [title, description, type, new Date(Date.now()).toISOString(), id],
  );
  return updateIssue;
};

const deleteIssueFromDB = async (id: number) => {
  const deleteIssue = await pool.query(`DELETE FROM issues WHERE id = $1`, [
    id,
  ]);
  return deleteIssue;
};

export const issueService = {
  createIsssuesInDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueInDB,
  deleteIssueFromDB,
};
