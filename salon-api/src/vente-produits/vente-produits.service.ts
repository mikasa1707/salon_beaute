import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { VenteProduit } from './entities/vente-produit.entity';
import { CreateVenteProduitDto } from './dto/create-vente-produit.dto';
import { UpdateVenteProduitDto } from './dto/update-vente-produit.dto';

@Injectable()
export class VenteProduitsService {
  constructor(
    @InjectRepository(VenteProduit)
    private readonly repo: Repository<VenteProduit>,
  ) {}

  async create(createDto: CreateVenteProduitDto) {
    const _data = this.repo.create(createDto);
    return await this.repo.save(_data);
  }

  async findAll(
    page = 1,
    limit = 10,
    search = '',
    status = '',
    typeProduitId = '',
  ) {
    const qb = this.repo
      .createQueryBuilder('vp')
      .leftJoinAndSelect('vp.vente', 'vente')
      .leftJoinAndSelect('vp.produitUnite', 'pu')
      .leftJoinAndSelect('pu.produit', 'produit')
      .leftJoinAndSelect('produit.typeProduit', 'typeProduit');

    // Recherche
    if (search.trim()) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('vp.label LIKE :search', {
            search: `%${search}%`,
          })
            .orWhere('pu.nom LIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('pu.label LIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('produit.nom LIKE :search', {
              search: `%${search}%`,
            });
        }),
      );
    }

    // Statut
    if (status.trim()) {
      qb.andWhere('vente.status = :status', {
        status,
      });
    }

    // Type produit
    if (typeProduitId.trim()) {
      const ids = typeProduitId.split(',').map(Number).filter(Number.isFinite);

      if (ids.length > 0) {
        qb.andWhere('typeProduit.id IN (:...ids)', {
          ids,
        });
      }
    }

    const [data, total] = await qb
      .orderBy('vp.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllByProduit(page = 1, limit = 10, search = '', venteId?: number) {
    const qb = this.repo
      .createQueryBuilder('vp')
      .leftJoinAndSelect('vp.vente', 'vente')
      .leftJoinAndSelect('vp.produitUnite', 'pu')
      .leftJoinAndSelect('pu.produit', 'produit')
      .leftJoinAndSelect('produit.typeProduit', 'typeProduit');

    // Vente obligatoire
    if (venteId) {
      qb.andWhere('vente.id = :venteId', {
        venteId,
      });
    }

    // Recherche
    if (search.trim()) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('vp.label LIKE :search', {
            search: `%${search}%`,
          })
            .orWhere('pu.nom LIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('pu.label LIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('produit.nom LIKE :search', {
              search: `%${search}%`,
            });
        }),
      );
    }

    const [data, total] = await qb
      .orderBy('vp.id', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const _data = await this.repo.findOne({
      where: { id },
      relations: { vente: true, produitUnite: true },
    });

    if (!_data) {
      throw new NotFoundException(`Vente produit ${id} introuvable`);
    }
    return _data;
  }

  async update(id: number, updateDto: UpdateVenteProduitDto) {
    const _data = await this.repo.preload({
      id,
      ...updateDto,
    });

    if (!_data) {
      throw new NotFoundException(`Marque ${id} introuvable`);
    }

    return await this.repo.save(_data);
  }

  async remove(id: number) {
    const _data = await this.findOne(id);
    return await this.repo.remove(_data);
  }
}
