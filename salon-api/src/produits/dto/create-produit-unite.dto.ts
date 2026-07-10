export class CreateProduitUniteDto {
    nom!: string; 
    code!: string;
    stock!: number;
    prix!: number;
    stock_minimum!: number;
    actif?: boolean;
}