import * as jwt from 'jsonwebtoken';
import User from '../entity/User';
import config from '../config';

const signJWT = (user: User): string => jwt.sign({
  id: user.id,
  username: user.username,
  role: user.role,
},
config.jwtSecret,
{
  expiresIn: config.jwtExpiration,
});

export { signJWT };
