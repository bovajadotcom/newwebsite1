export function requireAuth(req: ApiRequest, res: ApiResponse, next: ApiNext): void {
  if (!req.session.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
