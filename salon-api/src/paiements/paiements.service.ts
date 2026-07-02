import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Paiement } from './entities/paiement.entity';
import { CreatePaiementDto } from './dto/create-paiement.dto';
import { UpdatePaiementDto } from './dto/update-paiement.dto';

@Injectable()
export class PaiementsService {
  constructor(
    @InjectRepository(Paiement)
    private readonly repo: Repository<Paiement>,
  ) {}

  async create(createDto: CreatePaiementDto) {
    const _data = this.repo.create(createDto);
    return await this.repo.save(_data);
  }

  async findAll() {
    return this.repo.find({
      relations: {
        vente: true,
      },
    });
  }

  async findOne(id: number) {
    const _data = await this.repo.findOne({
      where: { id },
      relations: {
        vente: true,
      },
    });
    if (!_data) {
      throw new NotFoundException(`Paiement ${id} introuvable`);
    }
    return _data;
  }

  async update(id: number, updateDto: UpdatePaiementDto) {
    const _data = await this.repo.preload({
      id,
      ...updateDto,
    });

    if (!_data) {
      throw new NotFoundException(`Paiement ${id} introuvable`);
    }

    return await this.repo.save(_data);
  }

  async remove(id: number) {
    const _data = await this.findOne(id);
    return await this.repo.remove(_data);
  }
}
