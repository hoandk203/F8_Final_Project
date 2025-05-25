import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Length, MaxLength, Matches } from 'class-validator';
import { IssueStatus } from '../entities/issue.entity';

export class CreateIssueDto {
    @ApiProperty({
        description: 'Issue name/title',
        example: 'Wrong material weight'
    })
    @IsString()
    @IsNotEmpty()
    @Length(5, 100)
    issueName: string;

    @ApiProperty({
        description: 'Issue description',
        example: 'The weight of plastic materials was incorrectly measured'
    })
    @IsString()
    @IsNotEmpty()
    @Length(10, 500)
    description: string;

    @ApiProperty({
        description: 'Issue image in base64 format',
        example: 'data:image/jpeg;base64,...'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(5 * 1024 * 1024) // 5MB in base64
    @Matches(/^data:image\/(jpeg|png|jpg);base64,[A-Za-z0-9+/=]+$/, {
        message: 'Issue image must be a valid base64 image (JPEG, PNG, or JPG)'
    })
    issueImage: string;

    @ApiProperty({
        description: 'Store ID',
        example: 1
    })
    @IsNumber()
    @IsNotEmpty()
    storeId: number;

    @ApiProperty({
        description: 'Order ID',
        example: 1
    })
    @IsNumber()
    @IsNotEmpty()
    orderId: number;

    @ApiProperty({
        description: 'Issue status',
        enum: IssueStatus,
        default: IssueStatus.OPEN
    })
    @IsEnum(IssueStatus)
    @IsNotEmpty()
    status: IssueStatus;
} 