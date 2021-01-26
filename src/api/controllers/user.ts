import {
  NextFunction, Request, Response, Router,
} from 'express';
import isAuth from '../middlewares/isAuth';
import getCurrentUser from '../middlewares/getCurrentUser';
import UserService from '../../services/user';

export default (router: Router) => {
  router.use('/user', router);

  router.get('/me', isAuth, getCurrentUser, (req: Request, res: Response, next: NextFunction) => {
    res.json({ user: res.locals.currentUser });
  });

  router.get('/follow/:id', isAuth, getCurrentUser, async (req: Request, res: Response, next: NextFunction) => {
    const UserServiceInstance: UserService = new UserService();

    let { currentUser } = res.locals;

    try {
      currentUser = await UserServiceInstance.followUser(currentUser, req.params.id);
    } catch (e) {
      return next(e);
    }

    res.json(currentUser);
  });
};
