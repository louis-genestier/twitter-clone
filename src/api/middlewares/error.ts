import { NextFunction, Request, Response } from 'express';
import ErrorWithHttpStatus from '../../helpers/errorWithHttpStatus';

// eslint-disable-next-line no-unused-vars
export default (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithHttpStatus) {
    return res.status(err.status).json({
      error: err.message,
    });
  }

  return res.status(500).json({
    error: err.message,
  });
};
