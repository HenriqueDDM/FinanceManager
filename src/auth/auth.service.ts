import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IUser } from './types/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(email: string, passsword: string) {
    const user = await this.userService.findOne(email);
    const passswordIsMatch = await bcrypt.compare(passsword, user.password);
    if (user && passswordIsMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return user;
    }
    throw new UnauthorizedException('User or password are incorrect!');
  }

  async login(user: IUser) {
    const { id, email } = user;
    return {
      id,
      email,
      token: this.jwtService.sign({
        id: user.id,
        email: user.email,
      }),
    };
  }
}
