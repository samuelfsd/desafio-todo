import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { PrismaService } from 'src/database/PrismaService';
import { Todo } from '@prisma/client';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createTodoDto: CreateTodoDto): Promise<Todo> {
    const { title, description } = createTodoDto

    const todo = await this.prisma.todo.create({
      data: {
        title,
        description,
        user_id: userId
      }
    })

    return todo;
  }

  async findAll(id: number) {
    const todos = await this.prisma.todo.findMany({
      where: {
        user_id: id
      }
    })

    return todos
  }

  async remove(userId: number, todoId: number) {
    await this.prisma.todo.delete({
      where: {
        user_id: userId,
        id: todoId
      }
    })
  }
}
