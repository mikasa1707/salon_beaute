import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTypePrestationDto } from './dto/create-types-prestation.dto';
import { UpdateTypesPrestationDto } from './dto/update-types-prestation.dto';
import { TypePrestation } from './entities/types-prestation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Prestation } from '../prestations/entities/prestation.entity';

@Injectable()
export class TypesPrestationsService {
  constructor(
    @InjectRepository(TypePrestation)
    private readonly repo: Repository<TypePrestation>,
    @InjectRepository(Prestation)
    private readonly prestationRepo: Repository<Prestation>,
  ) {}

  async create(createDto: CreateTypePrestationDto) {
    const _data = this.repo.create(createDto);
    return await this.repo.save(_data);
  }

  async findAll(page = 1, limit = 10, search = '') {
    const [data, total] = await this.repo.findAndCount({
      where: [{ nom: ILike(`%${search}%`), actif: true }],
      relations: {
        prestations: true,
      },

      skip: (page - 1) * limit,
      take: limit,
      order: {
        nom: 'ASC',
      },
    });

    const datas = data.map(typeData => ({
      ...typeData,
      nbPrestation: typeData.prestations?.filter(p => p.actif).length ?? 0,
    }));
    return { data: datas , total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const _data = await this.repo.findOne({
      where: { id },
      relations: { prestations: true },
    });

    if (!_data) {
      throw new NotFoundException(`Type prestation ${id} introuvable`);
    }
    return _data;
  }

  async update(id: number, updateDto: UpdateTypesPrestationDto) {
    const _data = await this.repo.preload({
      id,
      ...updateDto,
    });

    if (!_data) {
      throw new NotFoundException(`Type prestation ${id} introuvable`);
    }

    return await this.repo.save(_data);
  }

  async remove(id: number) {
    const typePrestation = await this.findOne(id);

    if (!typePrestation) {
      throw new NotFoundException('Type Prestation introuvable');
    }
    await this.prestationRepo.update(
      { typePrestationId: id },
      { actif: false },
    );
    await this.repo.update(id, { actif: false });

    return {
      message:
        'Type de prestation et ses prestations associées désactivés avec succès',
    };
  }
}
