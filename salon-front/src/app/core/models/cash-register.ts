export interface CashRegister {

    id: number;

    ouverture: Date;

    fermeture?: Date;

    soldeOuverture: number;

    soldeFermeture?: number;

    statut: string;

}