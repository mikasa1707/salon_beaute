import { SetMetadata } from '@nestjs/common';
import { PersonnelRole } from '../../personnels/entities/personnel.entity';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: PersonnelRole[]) =>
  SetMetadata(ROLES_KEY, roles);
