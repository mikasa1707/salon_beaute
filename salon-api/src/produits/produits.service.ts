import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProduitDto } from './dto/create-produit.dto';
import { UpdateProduitDto } from './dto/update-produit.dto';
import { Produit } from './entities/produit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ProduitUnite } from './entities/produit_unites.entity';

@Injectable()
export class ProduitsService {
  constructor(
    @InjectRepository(Produit)
    private readonly repo: Repository<Produit>,

    @InjectRepository(ProduitUnite)
    private readonly uniteRepo: Repository<ProduitUnite>,
  ) {}

  async create(createDto: CreateProduitDto) {
    const { marqueId, typeProduitId, uniteConsommationId, ...data } = createDto;
    const produit = this.repo.create({
      ...data,
      marque: { id: Number(marqueId) },
      typeProduit: { id: Number(typeProduitId) },
      uniteConsommation: { id: Number(uniteConsommationId) },
    });
    return await this.repo.save(produit);
  }

  async findAll(page = 1, limit = 10, search = '') {
    const [data, total] = await this.repo.findAndCount({
      where: [
        {
          nom: ILike(`%${search}%`),
          actif: true,
        },
      ],
      relations: {
        marque: true,
        typeProduit: true,
        unites: true,
        uniteConsommation: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        nom: 'ASC',
      },
    });

    const produits = data.map((produit) => {
      const unitesActives =
        produit.unites?.filter((unite) => unite.actif) ?? [];
      return {
        ...produit,
        stockTotal: unitesActives.reduce((sum, unite) => sum + unite.stock, 0),
        isLowStock:
          unitesActives.reduce((sum, unite) => sum + unite.stock, 0) <=
          produit.stock_minimum,
        nbUnites: unitesActives.length,
        hasLowStockUnit: unitesActives.some(
          (unite) => unite.stock <= unite.stock_minimum,
        ),
        uniteConso: produit.uniteConsommation.symbole,
      };
    });

    return {
      data: produits,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const _data = await this.repo.findOne({
      where: { id },
      relations: {
        marque: true,
        typeProduit: true,
        unites: true,
        uniteConsommation: true,
      },
    });

    if (!_data) {
      throw new NotFoundException(`Produit ${id} introuvable`);
    }
    return _data;
  }

  async update(id: number, updateDto: UpdateProduitDto) {
    const { marqueId, typeProduitId, uniteConsommationId, ...data } = updateDto;
    const produit = await this.repo.preload({
      id,
      ...data,
      marque: marqueId ? { id: Number(marqueId) } : undefined,
      typeProduit: typeProduitId ? { id: Number(typeProduitId) } : undefined,
      uniteConsommation: { id: Number(uniteConsommationId) },
    });
    if (!produit) {
      throw new NotFoundException(`Produit ${id} introuvable`);
    }
    return await this.repo.save(produit);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.update(id, {
      actif: false,
    });
    return {
      message: 'Produit archivé',
    };
  }

  getTotalStock(produit: Produit): number {
    return produit.unites?.reduce((sum, u) => sum + u.stock, 0) ?? 0;
  }

  isLowStock(produit: Produit) {
    return this.getTotalStock(produit) <= produit.stock_minimum;
  }

  async getUnitStockAlerts() {
    const unites = await this.uniteRepo.find({
      relations: { produit: { marque: true } },
      where: {
        actif: true,
      },
    });

    return unites
      .map((u) => {
        const isLow = u.stock <= u.stock_minimum;

        return {
          id: u.id,
          produit: u.produit.nom,
          marque: u.produit.marque?.nom,

          unite: u.nom,
          stock: u.stock,
          stock_minimum: u.stock_minimum,

          is_low_stock: isLow,
        };
      })
      .filter((u) => u.is_low_stock);
  }
}
