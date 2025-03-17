import { Test, TestingModule } from '@nestjs/testing';
import { IssueMessageService } from './issue-message.service';

describe('IssueMessageService', () => {
  let service: IssueMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IssueMessageService],
    }).compile();

    service = module.get<IssueMessageService>(IssueMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
