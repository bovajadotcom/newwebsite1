interface SessionRequest {
  session: { userId?: number };
}

interface UnauthorizedResponse {
  status(statusCode: number): { json<T>(body: T): void };
}

type Continue = () => void;

export function requireAuth(req: SessionRequest, res: UnauthorizedResponse, next: Continue): void {
  if (!req.session.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
