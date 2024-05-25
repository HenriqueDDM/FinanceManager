import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TransactionDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  type: 'expense' | 'income';
}
