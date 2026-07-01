import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { SeedService } from './seed/seed.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private readonly seedService: SeedService) {}

  async onApplicationBootstrap() {
    await this.seedService.run();
    console.log('🚀 Seed exécuté au démarrage');
  }

  getHello(): string {
    return 'Salon API running';
  }
}
