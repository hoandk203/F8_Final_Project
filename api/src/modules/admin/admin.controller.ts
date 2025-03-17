import { Controller, Get, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UsersService } from '../users/users.service';
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly usersService: UsersService
  ) {}

}
