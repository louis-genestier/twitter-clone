import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../../entity/User';

const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  const user: User | null = await getRepository(User).findOne({
    where: {
      id: res.locals.userId,
    },
    relations: ['followers', 'following', 'posts'],
  });

  if (!user) {
    throw new Error('No user found.');
  }

  res.locals.currentUser = (user as User);

  next();
};

export default getCurrentUser;
