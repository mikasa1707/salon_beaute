import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTypePrestationDto } from './dto/create-types-prestation.dto';
import { UpdateTypesPrestationDto } from './dto/update-types-prestation.dto';
import { TypePrestation } from './entities/types-prestation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TypesPrestationsService {
  constructor(
    @InjectRepository(TypePrestation)
    private readonly repo: Repository<TypePrestation>,
  ) {}

  async create(createDto: CreateTypePrestationDto) {
    const _data = this.repo.create(createDto);
    return await this.repo.save(_data);
  }

  async findAll() {
    return await this.repo.find({
      relations: { prestations: true },
    });
  }

  async findOne(id: number) {
    const _data = await this.repo.findOne({
      where: { id },
      relations: { prestations: true },
    });

    if (!_data) {
      throw new NotFoundException(`Marque ${id} introuvable`);
    }
    return _data;
  }

  async update(id: number, updateDto: UpdateTypesPrestationDto) {
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
