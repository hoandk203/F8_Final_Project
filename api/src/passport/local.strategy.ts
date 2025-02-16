import {PassportStrategy} from "@nestjs/passport";
import { Strategy} from "passport-local";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {UsersService} from "../modules/users/users.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UsersService) {
        super({usernameField: 'email', passwordField: 'password'});
    }

    async validate(email:string, password: string){
        const user= await this.userService.validateUser(email, password);
        if(!user){
            throw new UnauthorizedException('Invalid email or password');
        }
        return user;
    }
}