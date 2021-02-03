import {
  NextFunction, Request, Response, Router,
} from 'express';
import { celebrate, Joi } from 'celebrate';
import Post from '../../entity/Post';
import PostService from '../../services/post';
import { IPostDTO } from '../../interfaces/postDTO';
import isAuth from '../middlewares/isAuth';
import getCurrentUser from '../middlewares/getCurrentUser';

export default (router: Router) => {
  router.use('/post', router);

  router.post('/', celebrate({
    body: Joi.object({
      content: Joi.string().required(),
    }),
  }), isAuth, getCurrentUser, async (req: Request, res: Response, next: NextFunction) => {
    const postService = new PostService();
    const post: Post = await postService.sendPost(res.locals.currentUser, req.body as IPostDTO);

    return res.json(post);
  });

  router.get('/timeline', isAuth, getCurrentUser, async (req: Request, res: Response, next: NextFunction) => {
    const postService = new PostService();

    const posts: Post[] | any = await postService.getTimelinePosts(res.locals.currentUser);

    return res.json(posts);
  });

  router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const postService = new PostService();

    try {
      const post: Post = await postService.findById(req.params.id);
      return res.json(post);
    } catch (e) {
      return next(e);
    }
  });

  router.get('/like/:id', isAuth, getCurrentUser, async (req: Request, res: Response, next: NextFunction) => {
    const postService = new PostService();

    try {
      const post: Post = await postService.findById(req.params.id);
      const data: Post = await postService.likePost(res.locals.currentUser, post);

      return res.json(data);
    } catch (e) {
      return next(e);
    }
  });
};
