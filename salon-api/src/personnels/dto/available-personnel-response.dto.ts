export class PersonnelConflictDto {
    reservationId!: number;
    client!: string;
    debut!: Date;
    fin!: Date;
}


export class AvailablePersonnelResponseDto {
    id!: number;
    nom!: string;
    prenom!: string;
    disponible!: boolean;
    conflicts!: PersonnelConflictDto[];
}