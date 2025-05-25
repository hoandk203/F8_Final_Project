import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Issue, IssueStatus } from './entities/issue.entity';
import { BaseService } from '../base/base.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { DriverService } from '../driver/driver.service';
import {v4 as uuidv4} from "uuid";
import { writeFile } from "fs";
import { UsersService } from '../users/users.service';
import { Driver } from '../driver/entities/driver.entity';

@Injectable()
export class IssueService extends BaseService {
    constructor(
        @Inject('ISSUE_REPOSITORY')
        private readonly issueRepository: Repository<Issue>,
        private readonly driverService: DriverService,
        private readonly userService: UsersService
    ) {
        super(issueRepository);
    }

    async saveBase64Image(imageBase64: string, folder: string): Promise<string> {

        try {
            const payload = imageBase64.split(',')[1];
            const fileName = `${uuidv4()}.png`;
            const path = `files/images/${folder}/${fileName}`;

            writeFile(path, payload, 'base64', (e) => {
                console.log(e)
            })

            const API_URL = process.env.API_URL || 'http://localhost:3000';
            return `${API_URL}/image?path=files%2Fimages%2F${folder}%2F${fileName}`;
        } catch (error) {
            console.error(error);
            throw new Error('Error saving image');
        }
    }

    async create(createIssueDto: CreateIssueDto): Promise<Issue> {

        const issueImageUrl = await this.saveBase64Image(createIssueDto.issueImage, 'issue');

        const driver = await this.driverService.getDriverByOrderId(createIssueDto.orderId);
        const issue = this.issueRepository.create({
            ...createIssueDto,
            issueImageUrl,
            driverId: driver ? driver.id : null
        });
        return this.issueRepository.save(issue);
    }

    async findAll() {
        const query = this.issueRepository
        .createQueryBuilder('issue')
        .leftJoin('driver', 'driver', 'driver.id = issue.driver_id')
        .select([
            'issue.*',
            'driver.fullname'
        ])
        .where('issue.active = :active', { active: true })
        .orderBy('issue.created_at', 'DESC')
        .getRawMany();

        return query;
    }

    async findOne(id: number): Promise<Issue> {
        const issue = await this.issueRepository.findOne({
            where: { id, active: true }
        });

        if (!issue) {
            throw new NotFoundException(`Issue with ID ${id} not found`);
        }

        return issue;
    }

    async update(id: number, updateIssueDto: UpdateIssueDto): Promise<Issue> {
        const issue = await this.findOne(id);

        // Nếu status được cập nhật thành RESOLVED, cập nhật resolvedAt
        if (updateIssueDto.status === IssueStatus.RESOLVED && issue.status !== IssueStatus.RESOLVED) {
            updateIssueDto['resolvedAt'] = new Date();
        }

        await this.issueRepository.update(id, {
            ...updateIssueDto,
            modifiedAt: new Date()
        });

        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.issueRepository.update(id, {
            active: false,
            modifiedAt: new Date()
        });
    }

    async adminSearchIssueByName(name: string): Promise<any> {
        const issues = await this.issueRepository
        .createQueryBuilder('issue')
        .select([
            'issue.*',
        ])
        .where("lower(issue.issue_name) LIKE :name", {name: `%${name.toLowerCase()}%`})
        .andWhere('issue.active = :active', { active: true })
        .orderBy('issue.created_at', 'DESC')
        .getRawMany();

        return issues;
    }

    async storeSearchIssueByName(name: string, storeId: number): Promise<any> {
        const issues = await this.issueRepository
        .createQueryBuilder('issue')
        .select([
            'issue.*',
        ])
        .where("lower(issue.issue_name) LIKE :name", {name: `%${name.toLowerCase()}%`})
        .andWhere('issue.active = :active', { active: true })
        .andWhere('issue.store_id = :storeId', { storeId })
        .orderBy('issue.created_at', 'DESC')
        .getRawMany();

        return issues;
    }

    async findByStore(storeId: number): Promise<any[]> {
        const issues = await this.issueRepository
        .createQueryBuilder('issue')
        .leftJoin('driver', 'driver', 'driver.id = issue.driver_id')
        .select([
            'issue.*',
            'driver.fullname'
        ])
        .where('issue.store_id = :storeId', { storeId })
        .andWhere('issue.active = :active', { active: true })
        .orderBy('issue.created_at', 'DESC')
        .getRawMany();

        return issues;
    }

    async findByDriver(driverId: number): Promise<Issue[]> {
        return this.issueRepository
        .createQueryBuilder('issue')
        .where('issue.driver_id = :driverId', { driverId })
        .andWhere('issue.active = :active', { active: true })
        .orderBy('issue.created_at', 'DESC')
        .getMany();
    }

    async findByOrder(orderId: number): Promise<Issue[]> {
        return this.issueRepository
        .createQueryBuilder('issue')
        .where('issue.order_id = :orderId', { orderId })
        .andWhere('issue.active = :active', { active: true })
        .orderBy('issue.created_at', 'DESC')
        .getMany();
    }

    async updateMessageCount(issueId: number, increment: number = 1): Promise<void> {
        await this.issueRepository
            .createQueryBuilder()
            .update(Issue)
            .set({
                messageCount: () => `message_count + ${increment}`,
                modifiedAt: new Date()
            })
            .where('id = :id', { id: issueId })
            .execute();
    }
}
