import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateTransactionDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsString()
  @MinLength(6)
  type: 'expense' | 'income';

  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  user: User;
}
