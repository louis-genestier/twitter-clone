import { hash, compare } from 'bcrypt';
import { getRepository, Repository } from 'typeorm';
import { IUserInputDTO } from '../interfaces/userInputDTO';
import User from '../entity/User';
import { signJWT } from '../helpers/jwt';
import ErrorWithHttpStatus from '../helpers/errorWithHttpStatus';

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
      throw new ErrorWithHttpStatus('No user found with that username.', 403);
    }

    const isValidPassword: boolean = await compare(userInputDTO.password, user.password);

    if (!isValidPassword) {
      throw new ErrorWithHttpStatus('Password is not correct.', 403);
    }

    const token: string = signJWT(user);

    return { user, token };
  }
}
