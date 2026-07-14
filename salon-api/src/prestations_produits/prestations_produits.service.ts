import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrestationProduit } from './entities/prestations-produits.entity';
import { Prestation } from 'src/prestations/entities/prestation.entity';
import { Produit } from 'src/produits/entities/produit.entity';
import { ProduitUnite } from 'src/produits/entities/produit_unites.entity';
import { CreatePrestationProduitDto } from './dto/create-prestation-produit.dto';

@Injectable()
export class PrestationProduitsService {
  constructor(
    @InjectRepository(PrestationProduit)
    private readonly repo: Repository<PrestationProduit>,

    @InjectRepository(Prestation)
    private readonly prestationRepo: Repository<Prestation>,

    @InjectRepository(Produit)
    private readonly produitRepo: Repository<Produit>,

    @InjectRepository(ProduitUnite)
    private readonly uniteRepo: Repository<ProduitUnite>,
  ) {}

  async findByPrestation(prestationId: number) {
    return this.repo.find({
      where: {
        prestation: {
          id: prestationId,
        },
      },
      relations: {
        produit: true,
        unite: true,
      },
    });
  }

  async create(prestationId: number, dto: CreatePrestationProduitDto) {
    const prestation = await this.prestationRepo.findOne({
      where: {
        id: prestationId,
      },
    });

    if (!prestation) {
      throw new NotFoundException('Prestation introuvable');
    }

    const produit = await this.produitRepo.findOne({
      where: {
        id: dto.produitId,
      },
    });

    if (!produit) {
      throw new NotFoundException('Produit introuvable');
    }

    const unite = await this.uniteRepo.findOne({
      where: {
        id: dto.uniteId,
      },
    });

    if (!unite) {
      throw new NotFoundException('Unité produit introuvable');
    }

    const data = this.repo.create({
      prestation: {
        id: prestationId,
      },

      produit: {
        id: dto.produitId,
      },

      unite: {
        id: dto.uniteId,
      },

      quantite: dto.quantite,
    });

    return this.repo.save(data);
  }

  async remove(id: number) {
    const data = await this.repo.findOne({
      where: {
        id,
      },
    });

    if (!data) {
      throw new NotFoundException('Produit prestation introuvable');
    }

    return this.repo.remove(data);
  }
}
