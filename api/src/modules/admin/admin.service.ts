import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { BaseService } from '../base/base.service';
import { CreateAdminDto } from './admin.dto';

@Injectable()
export class AdminService extends BaseService {
    constructor(
        @Inject('ADMIN_REPOSITORY')
        private adminRepository: Repository<Admin>,
    ) {
        super(adminRepository);
    }

    async create(data: CreateAdminDto) {
        // Check if admin with this email already exists
        const existingAdmin = await this.adminRepository.findOne({
            where: { email: data.email }
        });

        if (existingAdmin) {
            throw new ConflictException('Admin with this email already exists');
        }

        // Create new admin
        const admin = this.adminRepository.create({
            email: data.email,
            userId: data.userId
        });

        return this.adminRepository.save(admin);
    }

    async getByEmail(email: string) {
        return this.adminRepository
            .createQueryBuilder("admin")
            .select([
                'admin.*',
            ])
            .where("admin.email = :email", {email})
            .andWhere("admin.active = :active", {active: true})
            .getRawOne();
    }

    async getByUserId(userId: number) {
        return this.adminRepository
            .createQueryBuilder("admin")
            .where("admin.user_id = :userId", {userId})
            .andWhere("admin.active = :active", {active: true})
            .getOne();
    }
}
