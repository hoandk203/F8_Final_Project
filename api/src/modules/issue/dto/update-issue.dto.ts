import { PartialType } from '@nestjs/mapped-types';
import { CreateIssueDto } from './create-issue.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { IssueStatus } from '../entities/issue.entity';

export class UpdateIssueDto extends PartialType(CreateIssueDto) {
    @IsOptional()
    @IsEnum(IssueStatus)
    status?: IssueStatus;
} 