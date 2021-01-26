import { hash, compare } from 'bcrypt';
import { getRepository, Repository } from 'typeorm';
import { IUserInputDTO } from '../interfaces/userInputDTO';
import User from '../entity/User';
import { signJWT } from '../helpers/jwt';

export default class AuthService {
  private userRepository: Repository<User>;

  public constructor() {
    this.userRepository = getRepository(User);
  }

  public async SignUp(userInputDTO: IUserInputDTO): Promise<{ user: User, token: string }> {
    const hashedPassword: string = await hash(userInputDTO.password, 10);
    const user: User = new User();
    user.email = userInputDTO.email;
    user.username = userInputDTO.username;
    user.password = hashedPassword;

    await this.userRepository.save(user);

    const token: string = signJWT(user);

    return { user, token };
  }

  public async SignIn(userInputDTO: IUserInputDTO): Promise<{ user: User, token: string }> {
    const user: User = await this.userRepository.findOne({
      where: {
        username: userInputDTO.username,
      },
    });

    if (!user) {
      throw new Error('No user found with that username.');
    }

    const isValidPassword: boolean = await compare(userInputDTO.password, user.password);

    if (!isValidPassword) {
      throw new Error('Password is not correct.');
    }

    const token: string = signJWT(user);

    return { user, token };
  }
}
