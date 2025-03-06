import { Test, TestingModule } from '@nestjs/testing';
import { IdentityDocumentService } from './identity-document.service';

describe('IdentityDocumentService', () => {
  let service: IdentityDocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IdentityDocumentService],
    }).compile();

    service = module.get<IdentityDocumentService>(IdentityDocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
