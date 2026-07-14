import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  StockMovement,
  StockMovementType,
} from './entities/stock-movements.entity';
import { ProduitUnite } from '../produits/entities/produit_unites.entity';
import { PrestationProduit } from '../prestations_produits/entities/prestations-produits.entity';

@Injectable()
export class StockConsumptionService {
  constructor(
    @InjectRepository(ProduitUnite)
    private readonly uniteRepo: Repository<ProduitUnite>,

    @InjectRepository(PrestationProduit)
    private readonly prestationProduitRepo: Repository<PrestationProduit>,

    @InjectRepository(StockMovement)
    private readonly movementRepo: Repository<StockMovement>,
  ) {}

  async consumePrestation(prestationId: number, reference?: string) {
    const produits = await this.prestationProduitRepo.find({
      where: {
        prestation: {
          id: prestationId,
        },
      },

      relations: {
        unite: true,
        produit: true,
      },
    });

    for (const item of produits) {
      const unite = item.unite;

      if (unite.stock < item.quantite) {
        throw new BadRequestException(`Stock insuffisant : ${unite.nom}`);
      }

      // diminution stock

      unite.stock = Number(unite.stock) - Number(item.quantite);

      await this.uniteRepo.save(unite);

      // historique

      await this.movementRepo.save({
        produitUnite: unite,

        type: StockMovementType.OUT,

        quantite: item.quantite,

        reference,

        note: `Consommation prestation ${prestationId}`,
      });
    }

    return true;
  }
}
