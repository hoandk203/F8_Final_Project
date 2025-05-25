import {Body, Controller, Get, Post, Put, Request, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import {UsersService} from "../users/users.service";
import {LocalAuthGuard} from "../../guard/local-auth.guard";
import {JwtAuthGuard} from "../../guard/jwt-auth.guard";
import {DriverService} from "../driver/driver.service";
import {StoreService} from "../store/store.service";
import { VendorService } from '../vendor/vendor.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { IdentityDocumentService } from '../identity-document/identity-document.service';
import { VehicleService } from '../vehicle/vehicle.service';

@Controller('auth')
export class AuthController {
  constructor(
      private readonly authService: AuthService,
      private readonly userService: UsersService,
      private readonly driverService: DriverService,
      private readonly storeService: StoreService,
      private readonly vendorService: VendorService,
      private readonly identityDocumentService: IdentityDocumentService,
      private readonly vehicleService: VehicleService
  ) {}

  @Post('/register')
  register(@Body() data: any){
    return this.userService.create(data)
  }

  //flow: click login
  // -> thong qua local auth guard, chay ham validate trong passport local strategy
  // -> ham validate goi ham validateUser trong users service
  // -> tra ve user, tra nguoc vao request
  // -> lay request.user va truyen vao login trong auth service
  // -> tra ve access_token + refresh_token
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() request: any){
    return this.authService.login(request.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/verification-status')
  async verificationStatus(@Request() request: any){
    const userData= request.user
    
    if(userData.role === "driver"){
      let idVerification= false
      let driverVerification= false
      let vehicleVerification= false
      const identityDocument= await this.identityDocumentService.getOneByUserId(userData.id)
      if(!identityDocument){
        return{
          userId: userData.id,
          idVerification: false,
          driverVerification: false,
          vehicleVerification: false
        }
      }
      if(identityDocument){
        idVerification= true
        const driver= await this.driverService.getByUserIdForVerification(userData.id)
        
        if(driver){
          driverVerification= true
          const vehicle= await this.vehicleService.getVehicleInfo(driver.id)
          if(vehicle){
            vehicleVerification= true
          }
        }
      }
      return{
        userId: userData.id,
        identityDocumentId: identityDocument.id,
        idVerification,
        driverVerification,
        vehicleVerification
      }
    }

    if(userData.role === "store"){
      let storeVerification= false
      const store= await this.storeService.getByEmailForVerification(userData.email)
      if(store){
        storeVerification= true
      }
      return{
        userId: userData.id,
        storeVerification
      }
    }

    return{
      userId: userData.id,
      idVerification: false,
      driverVerification: false,
      vehicleVerification: false
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async profile(@Request() request: any){
    const userData= request.user
    if(userData.role === "driver"){
      const driver= await this.driverService.getByUserId(userData.id)
      return {
        ...driver,
        user: {...request.user},
      }
    }

    if(userData.role === "store"){
      const store= await this.storeService.getByEmail(userData.email)
      return {
        ...store,
        user: {...request.user},
      }
    }

    if(userData.role === "vendor"){
      const vendor= await this.vendorService.getByEmail(userData.email)
      return {
        ...vendor,
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
  async logout(@Request() request:any, @Body() body: { refresh_token: string }) {
    const userId = request.user.id;
    return this.authService.logout(userId, body.refresh_token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Request() req:any, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(
      req.user.id,
      changePasswordDto.oldPassword, 
      changePasswordDto.newPassword
    );
  }

  @Post('reset-password')
  async resetPassword(@Body() data: any) {
    return this.authService.resetPassword(data)
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-profile')
  async updateProfile(@Request() req:any, @Body() data: any) {
    return this.authService.updateProfile(req.user, data)
  }
}
