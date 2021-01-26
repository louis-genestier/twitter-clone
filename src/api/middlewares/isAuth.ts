import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import config from '../../config';
import { IJWTData } from '../../interfaces/JWTData';

const getToken = (headerValue: string | undefined): string | undefined => headerValue.split(' ')[1];

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const token: string | undefined = getToken(req.header('authorization'));
  if (!token) {
    throw new Error('You are not connected.');
  }

  const decodedData: object | string = verify(token, config.jwtSecret);
  res.locals.userId = (decodedData as IJWTData).id;
  return next();
};

export default isAuth;
