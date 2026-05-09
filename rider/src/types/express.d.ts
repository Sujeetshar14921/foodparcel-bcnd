declare namespace Express {
  interface Request {
    user?: { _id?: string; role?: string; [key: string]: any };
  }
}
