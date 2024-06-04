import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}
  async create(createTransactionDto: CreateTransactionDto, id: string) {
    const newTransaction = this.transactionRepository.create({
      title: createTransactionDto.title,
      amount: createTransactionDto.amount,
      type: createTransactionDto.type,
      category: { id: createTransactionDto.categoryId },
      user: { id },
    });
    if (!newTransaction) {
      throw new BadRequestException('Something went wrong');
    }
    await this.transactionRepository.save(newTransaction, { reload: true });
    return this.findOne(newTransaction.id);
  }

  async findAll(id: string) {
    const transactions = await this.transactionRepository.find({
      where: {
        user: { id },
      },
      order: {
        created_at: 'DESC',
      },
    });
    return transactions;
  }

  async findOne(id: string) {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id,
      },
      relations: {
        category: true,
        user: true,
      },
    });
    if (!transaction) {
      throw new NotFoundException('transaction doesnt exists');
    }
    if (transaction.user) {
      // Remover a senha do objeto user antes de retornar
      const userWithoutPassword = { ...transaction.user };
      delete userWithoutPassword.password;
      transaction.user = userWithoutPassword;
    }
    return transaction;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.transactionRepository.find({
      where: {
        id,
      },
    });
    if (!transaction) {
      throw new NotFoundException('Transaction doesnt exists');
    }
    return await this.transactionRepository.update(id, updateTransactionDto);
  }

  async remove(id: string) {
    const transaction = await this.transactionRepository.find({
      where: {
        id,
      },
    });
    if (!transaction) {
      throw new NotFoundException('Transaction doesnt exists');
    }
    return await this.transactionRepository.delete(id);
  }

  async findAllWithPagination(id: string, page: number, limit: number) {
    const transactions = await this.transactionRepository.find({
      where: {
        user: {
          id,
        },
      },
      relations: {
        category: true,
        user: true,
      },
      order: {
        created_at: 'DESC',
      },
      take: limit,
      skip: (page - 1) * limit,
    });
    return transactions;
  }

  async findAllByType(id: string, type: string) {
    const transactions = await this.transactionRepository.find({
      where: {
        user: { id },
        type,
      },
    });

    const total = transactions.reduce((acc, obj) => acc + obj.amount, 0);

    return total;
  }
}
