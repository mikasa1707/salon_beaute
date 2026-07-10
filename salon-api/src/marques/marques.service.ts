import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMarqueDto } from './dto/create-marque.dto';
import { UpdateMarqueDto } from './dto/update-marque.dto';
import { Marque } from './entities/marque.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class MarquesService {
  constructor(
    @InjectRepository(Marque)
    private readonly repo: Repository<Marque>,
  ) { }

  async create(createDto: CreateMarqueDto) {
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
        produits: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        nom: 'ASC',
      },
    });

    const produits = data.map(marque => ({
      ...marque,
      nbProduits: marque.produits?.filter(p => p.actif).length ?? 0,
    }));
    return { data: produits, total, page, limit, totalPages: Math.ceil(total / limit), };
  }

  async findOne(id: number) {
    const _data = await this.repo.findOne({
      where: { id },
      relations: { produits: true },
    });

    if (!_data) {
      throw new NotFoundException(`Marque ${id} introuvable`);
    }
    return _data;
  }

  async update(id: number, updateDto: UpdateMarqueDto) {
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
