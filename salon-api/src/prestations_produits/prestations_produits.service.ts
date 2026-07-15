import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { PrestationProduit } from './entities/prestations-produits.entity';
import { ProduitUnite } from 'src/produits/entities/produit_unites.entity';
import { Produit } from 'src/produits/entities/produit.entity';
import { PrestationRecette } from '../prestations-recettes/entities/prestations-recette.entity';
import { TransferPrestationProduitDto } from './dto/transfer-prestation-produit.dto';
import { UpdatePrestationProduitDto } from './dto/update-prestation-produit.dto';

@Injectable()
export class PrestationProduitsService {
  constructor(
    @InjectRepository(PrestationProduit)
    private readonly repo: Repository<PrestationProduit>,

    @InjectRepository(ProduitUnite)
    private readonly uniteRepo: Repository<ProduitUnite>,

    @InjectRepository(Produit)
    private readonly produitRepo: Repository<Produit>,
    @InjectRepository(PrestationRecette)
    private readonly recetteRepo: Repository<PrestationRecette>,
  ) {}

  /**
   * Liste du stock disponible pour prestations
   */
  // async findAll() {
  //   return this.repo.find({
  //     relations: {
  //       produit: true,
  //       unite: true,
  //     },
  //   });
  // }
  async findAll(page = 1, limit = 10, search = '') {
    const where = search
      ? [
          { produit: { nom: ILike(`%${search}%`) } },
          { unite: { nom: ILike(`%${search}%`) } },
        ]
      : {};

    const [data, total] = await this.repo.findAndCount({
      where,
      relations: {
        produit: {
          uniteConsommation: true,
        },
        unite: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        id: 'ASC',
      },
    });

    return {
      data: data.map((item) => ({
        ...item,
        produitId: item.produit.id,
        uniteMesure: item.produit.uniteConsommation,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  /**
   * Détail produit prestation
   */
  async findOne(id: number) {
    const data = await this.repo.findOne({
      where: {
        id,
      },
      relations: {
        produit: {
          uniteConsommation: true,
        },
        unite: true,
      },
    });
    if (!data) {
      throw new NotFoundException('Produit prestation introuvable');
    }
    return data;
  }
  /**
   * Stock disponible d'un produit prestation
   */
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
  /**
   * Transfert :
   *
   * ProduitUnite
   *      |
   *      v
   * PrestationProduit
   *
   */
  async transfer(dto: TransferPrestationProduitDto) {
    const unite = await this.uniteRepo.findOne({
      where: {
        id: dto.produitUniteId,
      },
      relations: {
        produit: true,
      },
    });

    if (!unite) {
      throw new NotFoundException('Produit unité introuvable');
    }

    if (unite.stock < dto.quantite) {
      throw new BadRequestException('Stock insuffisant');
    }

    // Décrément stock physique
    unite.stock -= dto.quantite;
    await this.uniteRepo.save(unite);

    // Conversion vers unité consommable
    const quantiteConvertie = dto.quantite * Number(unite.conversion);

    // Cherche une ligne existante
    const existant = await this.repo.findOne({
      where: {
        produit: {
          id: unite.produit.id,
        },
        unite: {
          id: unite.id,
        },
      },
    });

    if (existant) {
      existant.quantite = Number(existant.quantite) + quantiteConvertie;
      return this.repo.save(existant);
    }

    // Création nouvelle ligne
    const data = this.repo.create({
      produit: {
        id: unite.produit.id,
      },
      unite: {
        id: unite.id,
      },
      quantite: quantiteConvertie,
    });

    return this.repo.save(data);
  }
  /**
   * Récupérer recette d'une prestation
   *
   * Utilisé dans modal TERMINEE
   */
  async getRecette(prestationId: number) {
    return this.recetteRepo.find({
      where: {
        prestation: {
          id: prestationId,
        },
      },
      relations: {
        produit: true,
      },
    });
  }
  /**
   * Consommation réelle
   *
   * Appelé quand réservation TERMINEE
   */
  async consume(
    produits: {
      prestationProduitId: number;
      quantite: number;
    }[],
  ) {
    const consommation: PrestationProduit[] = [];
    for (const item of produits) {
      const prestationProduit = await this.repo.findOne({
        where: {
          id: item.prestationProduitId,
        },

        relations: {
          produit: true,
          unite: true,
        },
      });
      if (!prestationProduit) {
        throw new NotFoundException('Produit prestation introuvable');
      }
      if (prestationProduit.quantite < item.quantite) {
        throw new BadRequestException(
          `Stock insuffisant pour ${prestationProduit.produit.nom}`,
        );
      }
      prestationProduit.quantite -= item.quantite;
      consommation.push(await this.repo.save(prestationProduit));
    }
    return consommation;
  }

  /**
   * Suppression stock prestation
   */
  async remove(id: number) {
    const data = await this.findOne(id);
    return this.repo.remove(data);
  }

  async update(id: number, dto: UpdatePrestationProduitDto) {
    const data = await this.findOne(id);
    data.quantite = dto.quantite;
    return this.repo.save(data);
  }
}
