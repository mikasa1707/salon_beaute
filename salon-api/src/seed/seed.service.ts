import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import {
  Personnel,
  PersonnelRole,
} from '../personnels/entities/personnel.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Personnel)
    private readonly personnelRepo: Repository<Personnel>,
  ) {}

  async run() {
    const users = [
      {
        nom: 'Admin',
        prenom: 'System',
        telephone: '0300000000',
        specialite: 'Gestion',
        email: 'admin@salon.com',
        password: 'admin123',
        role: PersonnelRole.ADMIN,
      },
      {
        nom: 'Responsable',
        prenom: 'Salon',
        telephone: '0311111111',
        specialite: 'Gestion Salon',
        email: 'responsable@salon.com',
        password: 'responsable123',
        role: PersonnelRole.RESPONSABLE,
      },
    ];

    for (const u of users) {
      const exists = await this.personnelRepo.findOne({
        where: { email: u.email },
      });

      if (!exists) {
        const hashed = await bcrypt.hash(u.password, 10);

        const user = this.personnelRepo.create({
          ...u,
          password: hashed,
        });

        await this.personnelRepo.save(user);

        console.log(`✔ Seed user créé: ${u.email}`);
      }
    }
  }
}
