import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  async findAll() {
    return await this.repo.find({
      relations: { vente: true, produit: true },
    });
  }

  async findOne(id: number) {
    const _data = await this.repo.findOne({
      where: { id },
      relations: { vente: true, produit: true },
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
