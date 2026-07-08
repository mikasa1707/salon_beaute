import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProduitUniteDto } from './dto/create-produit-unite.dto';
import { UpdateProduitUniteDto } from './dto/update-produit-unite.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ProduitUnite } from './entities/produit_unites.entity';

@Injectable()
export class ProduitUniteService {
  constructor(
    @InjectRepository(ProduitUnite)
    private readonly repo: Repository<ProduitUnite>,
  ) { }

  async create(createDto: CreateProduitUniteDto) {
    const _data = this.repo.create(createDto);
    return await this.repo.save(_data);
  }

  async findAll(page = 1, limit = 10, search = '',) {
    const [data, total] = await this.repo.findAndCount({
      where: [
        {
          nom: ILike(`%${search}%`),
          actif: true,
        },
      ],
      relations: {
        produit: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        nom: 'ASC',
      },
    });

    const produits = data.map(produit => ({
      ...produit,
      stockTotal: this.getTotalStock(produit),
      isLowStock: this.isLowStock(produit),
    }));
    return { data: produits, total, page, limit, totalPages: Math.ceil(total / limit), };
  }

  async findOne(id: number) {
    const _data = await this.repo.findOne({
      where: { id },
      relations: {
        produit: true,
      }
    });

    if (!_data) {
      throw new NotFoundException(`Produit ${id} introuvable`);
    }
    return _data;
  }

  async update(id: number, updateDto: UpdateProduitUniteDto) {
    const _data = await this.repo.preload({
      id,
      ...updateDto,
    });

    if (!_data) {
      throw new NotFoundException(`Produit ${id} introuvable`);
    }

    return await this.repo.save(_data);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.update(id, {
      actif: false
    });
    return {
      message: 'Produit archivé'
    };
  }

  getTotalStock(produit: ProduitUnite): number {
    return produit.stock ?? 0;
  }

  isLowStock(produit: ProduitUnite) {
    return this.getTotalStock(produit) <= produit.stock_minimum;
  }

  async getUnitStockAlerts() {
    const unites = await this.repo.find({
      relations: { produit: { marque: true } },
      where: {
        actif: true
      }
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
