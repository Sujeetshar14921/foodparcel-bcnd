declare namespace Express {
  interface Request {
    user?: { _id?: string; role?: string; restaurantId?: string; [key: string]: any };
  }
}
