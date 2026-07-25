import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { UniteMesure } from './entities/unites-mesure.entity';
import { CreateUniteMesureDto } from './dto/create-unites-mesure.dto';
import { UpdateUnitesMesureDto } from './dto/update-unites-mesure.dto';

@Injectable()
export class UnitesMesureService {
  constructor(
    @InjectRepository(UniteMesure)
    private readonly repo: Repository<UniteMesure>,
  ) {}

  async findAll(page = 1, limit = 10, search = '') {
    const [data, total] = await this.repo.findAndCount({
      where: [
        {
          nom: ILike(`%${search}%`),
          actif: true,
        },
        {
          symbole: ILike(`%${search}%`),
          actif: true,
        },
      ],

      skip: (page - 1) * limit,
      take: limit,

      order: {
        nom: 'ASC',
      },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const unites = await this.repo.findOne({
      where: {
        id,
      },
    });

    if (!unites) {
      throw new NotFoundException('Unité de mesure introuvable');
    }

    return unites;
  }

  async create(dto: CreateUniteMesureDto) {
    const data = this.repo.create({
      nom: dto.nom,
      symbole: dto.symbole,
    });

    return this.repo.save(data);
  }

  async update(id: number, dto: UpdateUnitesMesureDto) {
    const unites = await this.findOne(id);

    Object.assign(unites, dto);

    return this.repo.save(unites);
  }

  async remove(id: number) {
    const unites = await this.findOne(id);

    unites.actif = false;

    return this.repo.save(unites);
  }
}
