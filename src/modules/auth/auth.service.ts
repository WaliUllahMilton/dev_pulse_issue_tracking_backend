import bcrypt from "bcrypt";
import config from "../../config";
import { pool } from "../../db";
import { jwtSign } from "../../utils";

const createUserInDB = async (
  name: string,
  email: string,
  password: string,
  role: string = "contributor",
) => {
  const hashPassword = await bcrypt.hash(
    password,
    Number(config.soltRounds as string),
  );
  const insertIntoDB = await pool.query(
    `INSERT INTO users(name,email,password,role)
        VALUES($1,$2,$3,$4)
        RETURNING *`,
    [name, email, hashPassword, role],
  );
  delete insertIntoDB.rows[0].password;
  return insertIntoDB;
};

const findUserByEmail = async (email: string) => {
  const user = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
  if (user && user.rowCount) {
    delete user.rows[0].password;
    return user;
  }
};

const loginUserByEmailAndPass = async (email: string, password: string) => {
  const user = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
  const isCorrectPassword = await bcrypt.compare(
    password,
    user.rows[0].password,
  );
  if (user && isCorrectPassword) {
    delete user.rows[0].password;
    const token = jwtSign(user.rows[0], "Bangladesh", { expiresIn: "1d" });

    return { ...user, token };
  } else if (!isCorrectPassword) {
    throw new Error("Password is wrong!");
  }
};

export const authService = {
  createUserInDB,
  findUserByEmail,
  loginUserByEmailAndPass,
};
