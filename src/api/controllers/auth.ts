import {
  Router, Request, Response, NextFunction,
} from 'express';
import { celebrate, Joi } from 'celebrate';
import User from '../../entity/User';
import AuthService from '../../services/auth';
import { IUserInputDTO } from '../../interfaces/userInputDTO';

export default (router: Router) => {
  router.use('/auth', router);

  router.post('/signup', celebrate({
    body: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().required().email(),
    }),
  }), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const AuthServiceInstance: AuthService = new AuthService();
      const {
        user,
        token,
      }: {
        user: User,
        token: string
      } = await AuthServiceInstance.SignUp(req.body as IUserInputDTO);

      return res.json({ user, token });
    } catch (e) {
      return next(e);
    }
  });

  router.post('/signin', celebrate({
    body: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const AuthServiceInstance: AuthService = new AuthService();
      const {
        user,
        token,
      }: {
        user: User,
        token: string,
      } = await AuthServiceInstance.SignIn(req.body as IUserInputDTO);

      return res.json({
        user,
        token,
      });
    } catch (e) {
      return next(e);
    }
  });
};
