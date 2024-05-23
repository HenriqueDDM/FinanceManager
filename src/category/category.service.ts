import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto, id: string) {
    const isExist = await this.categoryRepository.findBy({
      user: { id },
      title: createCategoryDto.title,
    });
    if (isExist.length) {
      throw new BadRequestException('This category already exists');
    }

    const newCategory = {
      title: createCategoryDto.title,
      user: {
        id,
      },
    };
    return await this.categoryRepository.save(newCategory);
  }

  async findAll(id: string) {
    return await this.categoryRepository.find({
      where: {
        user: { id },
      },
      relations: {
        transaction: true,
      },
    });
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
        transaction: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }
    if (category.user) {
      // Remover a senha do objeto user antes de retornar
      const userWithoutPassword = { ...category.user };
      delete userWithoutPassword.password;
      category.user = userWithoutPassword;
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return await this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Category doesnt exists');
    }
    return await this.categoryRepository.delete(id);
  }
}
