import dotenv from "dotenv";
import path from "path";

const filePath = path.join(process.cwd(), ".env");

dotenv.config({ path: filePath, debug: true });

const config = {
  port: process.env.PORT,
  connectionString: process.env.DB_CONNECTION_STRING,
  soltRounds: process.env.SALT_ROUNDS,
  jwtSecret: process.env.JWT_SECRET,
};

export default config;
