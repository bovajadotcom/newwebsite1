import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, eq, usersTable } from "@workspace/db";

const router = Router();

type LoginBody = {
  username?: string;
  password?: string;
};

router.post("/auth/login", async (req: ApiRequest<LoginBody>, res: ApiResponse): Promise<void> => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Username and password required" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.username, username));
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const valid = await bcrypt.compare(String(password), user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  req.session.userId = user.id;
  req.session.username = user.username;
  req.session.role = user.role;
  req.session.save((err?: unknown) => {
    if (err) {
      res.status(500).json({ error: "Session save failed" });
      return;
    }
    res.json({ id: user.id, username: user.username, role: user.role });
  });
});

router.post("/auth/logout", (req: ApiRequest, res: ApiResponse): void => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

router.get("/auth/me", (req: ApiRequest, res: ApiResponse): void => {
  if (!req.session.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json({ id: req.session.userId, username: req.session.username, role: req.session.role });
});

export default router;
