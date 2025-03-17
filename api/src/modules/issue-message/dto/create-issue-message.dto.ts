import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateIssueMessageDto {
    @IsNotEmpty()
    @IsNumber()
    issueId: number;

    @IsNotEmpty()
    @IsNumber()
    senderId: number;

    @IsNotEmpty()
    @IsString()
    message: string;

    @IsOptional()
    @IsArray()
    fileIds?: string[];
} 