import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, IsArray } from 'class-validator';
import { CreatorRole } from '../entities/issue.entity';

export class CreateIssueDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    orderId: number;

    @IsNotEmpty()
    @IsNumber()
    storeId: number;

    @IsOptional()
    @IsNumber()
    driverId?: number;

    @IsNotEmpty()
    @IsString()
    issueName: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsEnum(CreatorRole)
    creatorRole: CreatorRole;

    @IsNotEmpty()
    @IsString()
    issueImage: string;
} 