import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PrestationRecette } from './entities/prestations-recette.entity';
import { Prestation } from 'src/prestations/entities/prestation.entity';
import { Produit } from 'src/produits/entities/produit.entity';

import { CreatePrestationRecetteDto } from './dto/create-prestations-recette.dto';
import { CreatePrestationRecetteBulkDto } from './dto/create-prestations-recette-bulk.dto';

@Injectable()
export class PrestationsRecettesService {
  constructor(
    @InjectRepository(PrestationRecette)
    private readonly repo: Repository<PrestationRecette>,

    @InjectRepository(Prestation)
    private readonly prestationRepo: Repository<Prestation>,

    @InjectRepository(Produit)
    private readonly produitRepo: Repository<Produit>,
  ) {}

  findByPrestation(prestationId: number) {
    return this.repo.find({
      where: {
        prestation: {
          id: prestationId,
        },
      },
      relations: {
        produit: { uniteConsommation: true },
      },
    });
  }

  async create(prestationId: number, dto: CreatePrestationRecetteDto) {
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
      relations: {
        uniteConsommation: true,
      },
    });

    if (!produit) {
      throw new NotFoundException('Produit introuvable');
    }

    const exist = await this.repo.findOne({
      where: {
        prestation: {
          id: prestationId,
        },
        produit: {
          id: dto.produitId,
        },
      },
    });

    if (exist) {
      exist.quantite = Number(exist.quantite) + Number(dto.quantite);

      return this.repo.save(exist);
    }

    const recette = this.repo.create({
      prestation,
      produit,
      uniteMesure: produit.uniteConsommation,
      quantite: dto.quantite,
    });

    return this.repo.save(recette);
  }

  async update(id: number, quantite: number) {
    const recette = await this.repo.findOne({
      where: {
        id,
      },
    });

    if (!recette) {
      throw new NotFoundException('Recette introuvable');
    }

    recette.quantite = quantite;

    return this.repo.save(recette);
  }

  async remove(id: number) {
    const recette = await this.repo.findOne({
      where: {
        id,
      },
    });

    if (!recette) {
      throw new NotFoundException('Recette introuvable');
    }

    return this.repo.remove(recette);
  }

  async createBulk(
    prestationId: number,
    dto: CreatePrestationRecetteBulkDto,
  ): Promise<PrestationRecette[]> {
    const prestation = await this.prestationRepo.findOne({
      where: {
        id: prestationId,
      },
    });

    if (!prestation) {
      throw new NotFoundException('Prestation introuvable');
    }

    const results: PrestationRecette[] = [];

    for (const item of dto.produits) {
      const produit = await this.produitRepo.findOne({
        where: {
          id: item.produitId,
        },
        relations: {
          uniteConsommation: true,
        },
      });

      if (!produit) {
        throw new NotFoundException(`Produit ${item.produitId} introuvable`);
      }

      const exist = await this.repo.findOne({
        where: {
          prestation: {
            id: prestationId,
          },
          produit: {
            id: item.produitId,
          },
        },
      });

      if (exist) {
        exist.quantite = Number(exist.quantite) + Number(item.quantite);

        const updated: PrestationRecette = await this.repo.save(exist);

        results.push(updated);

        continue;
      }

      const recette = this.repo.create({
        prestation,
        produit,
        uniteMesure: produit.uniteConsommation,
        quantite: item.quantite,
      });

      const created: PrestationRecette = await this.repo.save(recette);

      results.push(created);
    }
    return results;
  }
}
