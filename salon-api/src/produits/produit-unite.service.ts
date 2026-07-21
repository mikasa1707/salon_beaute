import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProduitUniteDto } from './dto/create-produit-unite.dto';
import { UpdateProduitUniteDto } from './dto/update-produit-unite.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ProduitUnite } from './entities/produit_unites.entity';
import { Brackets } from 'typeorm';

@Injectable()
export class ProduitUniteService {
  constructor(
    @InjectRepository(ProduitUnite)
    private readonly repo: Repository<ProduitUnite>,
  ) {}

  async create(createDto: CreateProduitUniteDto) {
    const _data = this.repo.create(createDto);
    return await this.repo.save(_data);
  }

  async getAll(page = 1, limit = 10, search = '', typeProduitId = '') {
    const qb = this.repo
      .createQueryBuilder('pu')
      .leftJoinAndSelect('pu.produit', 'produit')
      .leftJoinAndSelect('produit.typeProduit', 'typeProduit')
      .where('pu.actif = :actif', { actif: true });

    // Recherche
    if (search.trim()) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('pu.nom LIKE :search', {
            search: `%${search}%`,
          })
            .orWhere('produit.nom LIKE :search', {
              search: `%${search}%`,
            })
            .orWhere("CONCAT(produit.nom, ' ', pu.nom) LIKE :search", {
              search: `%${search}%`,
            });
        }),
      );
    }

    // Filtre multi type
    if (typeProduitId) {
      const ids = typeProduitId
        .split(',')
        .map((id) => Number(id))
        .filter((id) => !isNaN(id));

      if (ids.length) {
        qb.andWhere('typeProduit.id IN (:...ids)', { ids });
      }
    }

    qb.orderBy('typeProduit.id', 'ASC')
      .addOrderBy('produit.nom', 'ASC')
      .addOrderBy('pu.nom', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    const produits = data.map((produit) => ({
      ...produit,
      stockTotal: this.getTotalStock(produit),
      isLowStock: this.isLowStock(produit),
      label: `${produit.produit.nom} ${produit.nom}`,
      uniteLabel: `${produit.conversion} ${produit.unite}`,
      couleur: produit.produit?.typeProduit?.color ?? '#6c757d',
    }));

    return {
      data: produits,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAll(produitId: number, page = 1, limit = 10, search = '') {
    const [data, total] = await this.repo.findAndCount({
      where: [
        {
          produit: { id: produitId },
          nom: ILike(`%${search}%`),
          actif: true,
        },
      ],
      relations: {
        produit: true,
        uniteMesure: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        nom: 'ASC',
      },
    });

    const produits = data.map((produit) => ({
      ...produit,
      stockTotal: this.getTotalStock(produit),
      isLowStock: this.isLowStock(produit),
    }));
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
        produit: true,
        uniteMesure: true,
      },
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
      actif: false,
    });
    return {
      message: 'Produit archivé',
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

  async findAllByType(
    typeProduitId: number,
    page = 1,
    limit = 10,
    search = '',
  ) {
    const qb = this.repo
      .createQueryBuilder('pu')
      .leftJoinAndSelect('pu.produit', 'produit')
      .leftJoinAndSelect('produit.typeProduit', 'typeProduit')
      .where('pu.actif = :actif', {
        actif: true,
      });

    qb.andWhere('typeProduit.id = :typeProduitId', {
      typeProduitId,
    });

    if (search.trim()) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('pu.nom LIKE :search', {
            search: `%${search}%`,
          })
            .orWhere('produit.nom LIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('pu.code LIKE :search', {
              search: `%${search}%`,
            });
        }),
      );
    }

    qb.orderBy('produit.nom', 'ASC')
      .addOrderBy('pu.nom', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    const produits = data.map((produit) => ({
      ...produit,

      label: `${produit.produit.nom} ${produit.nom}`,
      uniteLabel: `${produit.conversion} ${produit.unite}`,
      stockTotal: this.getTotalStock(produit),
      isLowStock: this.isLowStock(produit),
    }));

    return {
      data: produits,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
