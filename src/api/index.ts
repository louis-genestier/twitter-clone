import { Router } from 'express';
import auth from './controllers/auth';
import user from './controllers/user';
import post from './controllers/post';

export default () => {
  const router = Router();

  auth(router);
  user(router);
  post(router);

  return router;
};
