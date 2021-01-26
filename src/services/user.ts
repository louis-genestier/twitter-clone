import { getRepository, Repository } from 'typeorm';
import User from '../entity/User';

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
      throw new Error('There is no user with this id.');
    }

    if (currentUser.id === userToFollow.id) {
      throw new Error('You cannnot follow yourself.');
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
