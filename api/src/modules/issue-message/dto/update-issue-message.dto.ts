import { PartialType } from '@nestjs/mapped-types';
import { CreateIssueMessageDto } from './create-issue-message.dto';

export class UpdateIssueMessageDto extends PartialType(CreateIssueMessageDto) {} 