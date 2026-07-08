import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTypeProduitDto } from './dto/create-types-produit.dto';
import { UpdateTypesProduitDto } from './dto/update-types-produit.dto';
import { TypeProduit } from './entities/types-produit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class TypesProduitsService {
  constructor(
    @InjectRepository(TypeProduit)
    private readonly repo: Repository<TypeProduit>,
  ) {}

  async create(createDto: CreateTypeProduitDto) {
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
  
      const produits = data.map(produit => ({
        ...produit,
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
    await this.findOne(id);
    await this.repo.update(id, {
      actif: false
    });
    return {
      message: 'Produit archivé'
    };
  }
}
