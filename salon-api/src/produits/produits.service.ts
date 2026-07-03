import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProduitDto } from './dto/create-produit.dto';
import { UpdateProduitDto } from './dto/update-produit.dto';
import { Produit } from './entities/produit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const _data = this.repo.create(createDto);
    return await this.repo.save(_data);
  }

  async findAll() {
    return await this.repo.find({
      relations: { typeProduit: true, stock: true },
    });
  }

  async findOne(id: number) {
    const _data = await this.repo.findOne({
      where: { id },
      relations: { typeProduit: true, stock: true },
    });

    if (!_data) {
      throw new NotFoundException(`Produit ${id} introuvable`);
    }
    return _data;
  }

  async update(id: number, updateDto: UpdateProduitDto) {
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
    const _data = await this.findOne(id);
    return await this.repo.remove(_data);
  }

  getTotalStock(produit: Produit) {
    return produit.unites?.reduce((sum, u) => sum + u.stock, 0) ?? 0;
  }

  isLowStock(produit: Produit) {
    return this.getTotalStock(produit) <= produit.stock_minimum;
  }

  async getUnitStockAlerts() {
    const unites = await this.uniteRepo.find({
      relations: { produit: { marque: true } },
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
