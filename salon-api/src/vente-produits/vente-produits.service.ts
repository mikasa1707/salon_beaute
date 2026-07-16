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

  async findAll(page = 1, limit = 10, search = '', typeProduitId?: number) {
    const qb = this.repo
      .createQueryBuilder('vp')
      .leftJoinAndSelect('vp.vente', 'vente')
      .leftJoinAndSelect('vp.produitUnite', 'pu')
      .leftJoinAndSelect('pu.produit', 'produit')
      .leftJoinAndSelect('produit.typeProduit', 'typeProduit');

    // Recherche
    if (search) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('vp.label LIKE :search', {
            search: `%${search}%`,
          })
            .orWhere('pu.nom LIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('pu.nomComplet LIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('produit.nom LIKE :search', {
              search: `%${search}%`,
            });
        }),
      );
    }

    // Filtre par type
    if (typeProduitId) {
      qb.andWhere('typeProduit.id = :typeProduitId', {
        typeProduitId,
      });
    }

    qb.orderBy('vp.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

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
