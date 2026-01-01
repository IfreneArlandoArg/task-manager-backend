import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();


const PORT = process.env.PORT||3000;


const app = express();
const prisma = new PrismaClient();


app.use(cors());
app.use(express.json());

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);
  req.user = jwt.verify(token, process.env.JWT_SECRET);
  next();
};

app.post("/register", async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  const user = await prisma.user.create({
    data: { email: req.body.email, password: hash }
  });
  res.json(user);
});

app.post("/login", async (req, res) => {
  const user = await prisma.user.findUnique({ where: { email: req.body.email }});
  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    return res.sendStatus(401);

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  res.json({ token });
});

app.get("/tasks", auth, async (req, res) => {
  const tasks = await prisma.task.findMany({ where: { userId: req.user.id }});
  res.json(tasks);
});

app.post("/tasks", auth, async (req, res) => {
  const task = await prisma.task.create({
    data: { title: req.body.title, status: "Todo", userId: req.user.id }
  });
  res.json(task);
});

app.listen(PORT, () => console.log(`Server running http://localhost:${PORT}`));
