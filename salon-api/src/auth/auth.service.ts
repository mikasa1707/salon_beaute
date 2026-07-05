import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { Personnel } from '../personnels/entities/personnel.entity';
import { AuditLogService } from 'src/audit-log/audit-log.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Personnel)
    private personnelRepo: Repository<Personnel>,
    private jwtService: JwtService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.personnelRepo.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Mot de passe incorrect');
    }

    await this.auditLogService.log({
      action: 'LOGIN',
      entity: 'PERSONNEL',
      entityId: user.id,
      userId: user.id,
      username: user.nom + ' ' + user.prenom,
      payload: {
        total: 0,
      },
    });

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      nom: user.nom,
      prenom: user.prenom,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        email: user.email,
      },
    };
  }
}
