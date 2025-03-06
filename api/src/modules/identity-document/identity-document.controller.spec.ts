import { Test, TestingModule } from '@nestjs/testing';
import { IdentityDocumentController } from './identity-document.controller';
import { IdentityDocumentService } from './identity-document.service';

describe('IdentityDocumentController', () => {
  let controller: IdentityDocumentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IdentityDocumentController],
      providers: [IdentityDocumentService],
    }).compile();

    controller = module.get<IdentityDocumentController>(IdentityDocumentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
