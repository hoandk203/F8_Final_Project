import {Body, Controller, Get, Post, Request, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import {UsersService} from "../users/users.service";
import {LocalAuthGuard} from "../../guard/local-auth.guard";
import {JwtAuthGuard} from "../../guard/jwt-auth.guard";
import {DriverService} from "../driver/driver.service";
import {StoreService} from "../store/store.service";
@Controller('auth')
export class AuthController {
  constructor(
      private readonly authService: AuthService,
      private readonly userService: UsersService,
      private readonly driverService: DriverService,
      private readonly storeService: StoreService
  ) {}

  @Post('/register')
  register(@Body() data: any){
    return this.userService.create(data)
  }

  //flow: click login
  // -> thong qua local auth guard, chay ham validate trong local auth guard
  // -> ham validate goi ham validateUser trong users service
  // -> tra ve user, tra nguoc vao request
  // -> lay request.user va truyen vao login trong auth service
  // -> tra ve access_token + refresh_token
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() request: any){
    return this.authService.login(request.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async profile(@Request() request: any){
    const userData= request.user
    console.log(userData)
    if(userData.role === "driver"){
      const driver= await this.driverService.getByUserId(userData.id)
      return {
        ...driver,
        user: {...request.user},
      }
    }
    if(userData.role === "store"){
      const store= await this.storeService.getById(userData.email)
      return {
        ...store,
        user: {...request.user},
      }
    }
    return request.user
  }

  @Post('/refresh-token')
  async refresh(@Body() body: {refresh_token: string}){
    return this.authService.refreshToken(body.refresh_token)
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Request() request, @Body() body: { refresh_token: string }) {
    const userId = request.user.id;
    return this.authService.logout(userId, body.refresh_token);
  }
}
