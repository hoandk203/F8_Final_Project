import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.getList();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.getOne(Number(id));
  }

  @Post(`/send-mail`)
  sendMail(@Body() createUserDto: CreateUserDto) {
    return this.usersService.sendMail(createUserDto)
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post(`/login`)
  login(@Body() dataLogin) {
      const {email, password}= dataLogin

      return this.usersService.login(email, password)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateOne(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.softDelete(+id);
  }
}
