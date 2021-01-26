import { getRepository, Repository } from 'typeorm';
import Post from '../entity/Post';
import User from '../entity/User';
import { IPostDTO } from '../interfaces/postDTO';

export default class PostService {
  private postRepository: Repository<Post>;

  public constructor() {
    this.postRepository = getRepository(Post);
  }

  public async sendPost(user: User, postDTO: IPostDTO): Promise<Post> {
    const post = new Post();
    post.content = postDTO.content;
    post.author = user;
    await this.postRepository.save(post);

    return post;
  }

  public async findById(id: string): Promise<Post> {
    const post: Post | undefined = await this.postRepository.findOne(id);

    if (!post) {
      throw new Error('No post found.');
    }

    return post;
  }

  public async getTimelinePosts(user: User): Promise<any> {
    const followedUsersId: number[] = user.following.map((f) => f.id);

    const posts: Post[] = await this.postRepository.createQueryBuilder('p')
      .leftJoinAndSelect('p.author', 'a')
      .where('a.id IN (:ids)', { ids: followedUsersId })
      .orderBy('p.createdAt', 'DESC')
      .getMany();

    return posts;
  }
}
