import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { IssueStatus } from '../entities/issue.entity';

export class UpdateIssueDto {
    @ApiProperty({
        description: 'Issue name/title',
        example: 'Wrong material weight',
        required: false
    })
    @IsString()
    @IsOptional()
    @Length(5, 100)
    issueName?: string;

    @ApiProperty({
        description: 'Issue description',
        example: 'The weight of plastic materials was incorrectly measured',
        required: false
    })
    @IsString()
    @IsOptional()
    @Length(10, 500)
    description?: string;

    @ApiProperty({
        description: 'Issue status',
        enum: IssueStatus
    })
    @IsEnum(IssueStatus)
    @IsNotEmpty()
    status: IssueStatus;

    @ApiProperty({
        description: 'Admin response',
        example: 'We will investigate this issue',
        required: false
    })
    @IsString()
    @IsOptional()
    @Length(10, 500)
    adminResponse?: string;
} 