import { PartialType } from '@nestjs/swagger';
import { CreatePrestationProduitDto } from './create-prestation-produit.dto';
import { IsNumber, Min } from 'class-validator';

export class UpdatePrestationProduitDto extends PartialType(CreatePrestationProduitDto) {

    @IsNumber()
    @Min(0)
    quantite!: number;
}
