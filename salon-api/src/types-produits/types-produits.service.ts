import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTypesProduitDto } from './dto/create-types-produit.dto';
import { UpdateTypesProduitDto } from './dto/update-types-produit.dto';
import { TypeProduit } from './entities/types-produit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TypesProduitsService {
  constructor(
    @InjectRepository(TypeProduit)
    private readonly repo: Repository<TypeProduit>,
  ) {}

  async create(createDto: CreateTypesProduitDto) {
    const _data = this.repo.create(createDto);
    return await this.repo.save(_data);
  }

  async findAll() {
    return await this.repo.find({
      relations: { produits: true },
    });
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

  async update(id: number, updateDto: UpdateTypesProduitDto) {
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
