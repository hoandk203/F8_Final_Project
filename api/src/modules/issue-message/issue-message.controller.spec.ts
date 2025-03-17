import { Test, TestingModule } from '@nestjs/testing';
import { IssueMessageController } from './issue-message.controller';
import { IssueMessageService } from './issue-message.service';

describe('IssueMessageController', () => {
  let controller: IssueMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IssueMessageController],
      providers: [IssueMessageService],
    }).compile();

    controller = module.get<IssueMessageController>(IssueMessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
