import { PersonnelRole } from '../../personnels/entities/personnel.entity';

export type AuthUser = {
  userId: number;
  email: string;
  role: PersonnelRole;
};
