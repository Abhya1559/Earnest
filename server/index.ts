import express from "express";
import type { Request, Response } from "express";
import { db } from "./config/db.js";

const app = express();
const PORT = 5000;

(async () => {
  const conn = await db.getConnection();
  console.log("MySQL Connected ✅");
  conn.release();
})();
app.get("/", (req: Request, res: Response) => {
  res.send("Hello I am server");
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
