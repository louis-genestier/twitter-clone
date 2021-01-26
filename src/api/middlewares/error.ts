import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line no-unused-vars
export default (err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    error: err.message,
  });
};
