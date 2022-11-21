import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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
