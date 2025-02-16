import {PassportStrategy} from "@nestjs/passport";
import {Injectable} from "@nestjs/common";
import {ExtractJwt, Strategy} from "passport-jwt";
import {UsersService} from "../modules/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: "67941cd45fe6ebd906ed2f751aaf49dea7be39a590b562bb3f88aa2f6194a2c1"
        });
    }

    async validate(payload: any){
        return await this.userService.getByEmail(payload.email)
    }
}