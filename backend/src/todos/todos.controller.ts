import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post('/:id')
  create(@Param('id') id:string, @Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(+id, createTodoDto);
  }

  @Get('/:id')
  findAllByUserId(@Param('id') id: string) {
    return this.todosService.findAll(+id);
  }

  @Delete('/:userId/:todoId')
  remove(@Param('userId') userId: string, @Param('todoId') todoId: string) {
    this.todosService.remove(+userId, +todoId);
  }
}
