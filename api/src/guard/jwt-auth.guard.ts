import {ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {JwtService} from "@nestjs/jwt";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly jwtService: JwtService) {
        super();
    }

    canActive(context: ExecutionContext){
        return super.canActivate(context)
    }

    handleRequest(err, user, info){
        if(info instanceof jwt.TokenExpiredError){
            throw new UnauthorizedException("Access token expired")
        }
        if(info || err){
            throw new UnauthorizedException('Invalid access token');
        }
        return user
    }
}