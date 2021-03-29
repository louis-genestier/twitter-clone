import { getRepository, Repository } from 'typeorm';
import User from '../entity/User';
import ErrorWithHttpStatus from '../helpers/errorWithHttpStatus';

export default class UserService {
  private userRepository: Repository<User>;

  public constructor() {
    this.userRepository = getRepository(User);
  }

  public async followUser(currentUser: User, userToFollowId: string): Promise<User> {
    const userToFollow: User = await this.userRepository.findOne({
      where: {
        id: userToFollowId,
      },
    });

    if (!userToFollow) {
      throw new ErrorWithHttpStatus('There is no user with this id.', 403);
    }

    if (currentUser.id === userToFollow.id) {
      throw new ErrorWithHttpStatus('You cannnot follow yourself.', 400);
    }

    const isFollowing: boolean = await this.isFollowing(currentUser, userToFollow);

    if (isFollowing) {
      currentUser.following = currentUser.following.filter((f) => f.id !== userToFollow.id);
      await this.userRepository.save(currentUser);
      return currentUser;
    }

    currentUser.following.unshift(userToFollow);

    await this.userRepository.save(currentUser);

    return currentUser;
  }

  private async isFollowing(currentUser: User, targetUser: User): Promise<boolean> {
    const isFollowing = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.following', 'targetUser')
      .where('user.id = :userId', { userId: currentUser.id })
      .andWhere('targetUser.id = :targetId', { targetId: targetUser.id })
      .getCount();

    return Boolean(isFollowing);
  }
}
