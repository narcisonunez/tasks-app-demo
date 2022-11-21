import { Request, Response, NextFunction } from 'express';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.loggedUser) {
    return res.status(401).send({ message: 'Unauthorized' })
  }

  next();
};