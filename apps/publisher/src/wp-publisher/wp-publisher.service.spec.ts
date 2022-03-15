import { Test, TestingModule } from '@nestjs/testing';
import { WpPublisherService } from './wp-publisher.service';

describe('WpPublisherService', () => {
  let service: WpPublisherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WpPublisherService],
    }).compile();

    service = module.get<WpPublisherService>(WpPublisherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
