import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IssueMessage } from './entities/issue-message.entity';
import { CreateIssueMessageDto } from './dto/create-issue-message.dto';
import { UpdateIssueMessageDto } from './dto/update-issue-message.dto';
import { BaseService } from '../base/base.service';
import { IssueService } from '../issue/issue.service';

@Injectable()
export class IssueMessageService extends BaseService {
    constructor(
        @Inject('ISSUE_MESSAGE_REPOSITORY')
        private readonly issueMessageRepository: Repository<IssueMessage>,
        private readonly issueService: IssueService
    ) {
        super(issueMessageRepository);
    }

    async create(createIssueMessageDto: CreateIssueMessageDto): Promise<IssueMessage> {
        // Kiểm tra issue có tồn tại không
        await this.issueService.findOne(createIssueMessageDto.issueId);

        // Tạo tin nhắn mới
        const newMessage = this.issueMessageRepository.create({
            ...createIssueMessageDto
        });

        // Lưu tin nhắn
        const savedMessage = await this.issueMessageRepository.save(newMessage);

        // Cập nhật số lượng tin nhắn trong issue
        await this.issueService.updateMessageCount(createIssueMessageDto.issueId);

        return savedMessage;
    }

    async findAllByIssueId(issueId: number, page = 1, limit = 20): Promise<{ messages: IssueMessage[], total: number }> {
        // Kiểm tra issue có tồn tại không
        await this.issueService.findOne(issueId);

        const queryBuilder = this.issueMessageRepository.createQueryBuilder('message')
            .where('message.issue_id = :issueId', { issueId })
            .andWhere('message.active = :active', { active: true })
            .orderBy('message.created_at', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);

        const [messages, total] = await queryBuilder.getManyAndCount();

        return { messages, total };
    }

    async findOne(id: number): Promise<IssueMessage> {
        const message = await this.issueMessageRepository.createQueryBuilder('message')
            .where('message.id = :id', { id })
            .andWhere('message.active = :active', { active: true })
            .getOne();

        if (!message) {
            throw new NotFoundException(`Message with ID ${id} not found`);
        }

        return message;
    }

    async update(id: number, updateIssueMessageDto: UpdateIssueMessageDto): Promise<IssueMessage> {
        const message = await this.findOne(id);
        
        await this.issueMessageRepository.createQueryBuilder()
            .update(IssueMessage)
            .set({
                ...updateIssueMessageDto,
                modifiedAt: new Date()
            })
            .where('id = :id', { id })
            .execute();
            
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const message = await this.findOne(id);
        
        await this.issueMessageRepository.createQueryBuilder()
            .update(IssueMessage)
            .set({
                active: false,
                modifiedAt: new Date()
            })
            .where('id = :id', { id })
            .execute();

        // Giảm số lượng tin nhắn trong issue
        await this.issueService.updateMessageCount(message.issueId, -1);
    }
}
