import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePrestationDto } from './dto/create-prestation.dto';
import { UpdatePrestationDto } from './dto/update-prestation.dto';
import { Prestation } from './entities/prestation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PrestationsService {
  constructor(
    @InjectRepository(Prestation)
    private readonly repo: Repository<Prestation>,
  ) {}

  async create(createDto: CreatePrestationDto) {
    const _data = this.repo.create(createDto);
    return await this.repo.save(_data);
  }

  async findAll() {
    return await this.repo.find({
      relations: { typePrestation: true, reservations: true },
    });
  }

  async findOne(id: number) {
    const _data = await this.repo.findOne({
      where: { id },
      relations: { typePrestation: true, reservations: true },
    });

    if (!_data) {
      throw new NotFoundException(`Prestation ${id} introuvable`);
    }
    return _data;
  }

  async update(id: number, updateDto: UpdatePrestationDto) {
    const _data = await this.repo.preload({
      id,
      ...updateDto,
    });

    if (!_data) {
      throw new NotFoundException(`Prestation ${id} introuvable`);
    }

    return await this.repo.save(_data);
  }

  async remove(id: number) {
    const _data = await this.findOne(id);
    return await this.repo.remove(_data);
  }
}
