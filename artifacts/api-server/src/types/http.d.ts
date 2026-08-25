type ApiParams = Record<string, string | string[]>;
interface ApiQuery {
  [key: string]: string | ApiQuery | Array<string | ApiQuery> | undefined;
}
type ApiBody = Record<string, unknown>;

interface ApiSession {
  userId?: number;
  username?: string;
  role?: string;
  save(callback: (error?: unknown) => void): void;
  destroy(callback: (error?: unknown) => void): void;
}

interface ApiUploadFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

interface ApiLogger {
  warn(...args: unknown[]): void;
  error(...args: unknown[]): void;
}

interface ApiRequest<
  Body = ApiBody,
  Params extends ApiParams = ApiParams,
  Query extends ApiQuery = ApiQuery,
> {
  body: Body;
  params: Params;
  query: Query;
  headers: Record<string, string | string[] | undefined>;
  session: ApiSession;
  file?: ApiUploadFile;
  log: ApiLogger;
}

interface ApiResponse {
  status(statusCode: number): ApiResponse;
  json<T>(body: T): ApiResponse;
  send(body?: unknown): ApiResponse;
  sendStatus(statusCode: number): ApiResponse;
  set(name: string, value: string): ApiResponse;
  setHeader(name: string, value: string): ApiResponse;
}

type ApiNext = (error?: unknown) => void;