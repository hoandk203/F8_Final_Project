import {Inject, Injectable} from '@nestjs/common';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';

@Injectable()
export class RefreshTokenService {
    constructor(
        @Inject('REFRESH_REPOSITORY')
        private readonly refreshTokenRepository: Repository<RefreshToken>,
    ) {}

    async create(userId: number, token: string, expiresAt: Date, uuid: string): Promise<void>{
        await this.refreshTokenRepository
            .createQueryBuilder('refresh_token')
            .insert()
            .values({userId, token, expiresAt, uuid})
            .execute()
    }

    async findTokenByUuid(userId: number, uuid: string) {
        return this.refreshTokenRepository
            .createQueryBuilder('refresh_token')
            .select()
            .where('refresh_token.userId= :userId', {userId})
            .andWhere('refresh_token.uuid= :uuid', {uuid})
            .getOne()
    }

    async deleteTokenById(id: number){
        await this.refreshTokenRepository
            .createQueryBuilder()
            .delete()
            .from(RefreshToken)
            .where('id= :id', {id})
            .execute()
    }

    async deleteTokenByUser(userId: number){
        await this.refreshTokenRepository
            .createQueryBuilder()
            .delete()
            .from(RefreshToken)
            .where('userId= :userId', {userId})
            .execute()
    }

    async deleteTokenByUuid(userId: number, uuid: string): Promise<void> {
        await this.refreshTokenRepository.delete({
            userId,
            uuid
        });
    }
}
