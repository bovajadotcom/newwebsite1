import { timingSafeEqual } from "node:crypto";
import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, eq, usersTable } from "@workspace/db";

const router = Router();
const RESET_TOKEN_ENV = "ADMIN_PASSWORD_RESET_TOKEN";
const BCRYPT_COST = 10;
const MIN_TOKEN_BYTES = 32;

function hasValidResetToken(providedToken: string | undefined, expectedToken: string | undefined): boolean {
  if (!providedToken || !expectedToken) {
    return false;
  }

  const provided = Buffer.from(providedToken, "utf8");
  const expected = Buffer.from(expectedToken, "utf8");

  return (
    expected.length >= MIN_TOKEN_BYTES &&
    provided.length === expected.length &&
    timingSafeEqual(provided, expected)
  );
}

router.post(
  "/admin/reset-admin-password",
  async (req: ApiRequest<{ password?: unknown }>, res: ApiResponse): Promise<void> => {
    const authorizationHeader = req.headers.authorization;
    const authorization = Array.isArray(authorizationHeader)
      ? authorizationHeader[0]
      : authorizationHeader;
    const providedToken = authorization?.startsWith("Bearer ")
      ? authorization.slice("Bearer ".length)
      : undefined;
    const expectedToken = process.env[RESET_TOKEN_ENV];

    if (!hasValidResetToken(providedToken, expectedToken)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const password = req.body?.password;
    if (typeof password !== "string" || password.length === 0) {
      res.status(400).json({ error: "Password is required" });
      return;
    }

    try {
      const result = await db.transaction(async (tx) => {
        const [admin] = await tx
          .select({
            id: usersTable.id,
            passwordHash: usersTable.passwordHash,
          })
          .from(usersTable)
          .where(eq(usersTable.username, "admin"))
          .for("update");

        if (!admin) {
          return { status: "not-found" as const };
        }

        if (await bcrypt.compare(password, admin.passwordHash)) {
          return {
            status: "verified" as const,
            updated: false,
          };
        }

        const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
        const [updatedAdmin] = await tx
          .update(usersTable)
          .set({ passwordHash })
          .where(eq(usersTable.username, "admin"))
          .returning({ passwordHash: usersTable.passwordHash });

        if (!updatedAdmin || !(await bcrypt.compare(password, updatedAdmin.passwordHash))) {
          throw new Error("Stored password hash verification failed");
        }

        return {
          status: "verified" as const,
          updated: true,
        };
      });

      if (result.status === "not-found") {
        res.status(404).json({ error: "Admin user not found" });
        return;
      }

      res.json({
        ok: true,
        bcryptVerified: true,
        updated: result.updated,
      });
    } catch {
      res.status(500).json({ error: "Password reset failed" });
    }
  },
);

export default router;