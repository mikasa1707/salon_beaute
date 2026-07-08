import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto) {
    const client = this.clientRepo.create(createClientDto);
    return await this.clientRepo.save(client);
  }

  async findAll(page = 1, limit = 10, search = '') {
    const [data, total] = await this.clientRepo.findAndCount({
      where: [
        { nom: ILike(`%${search}%`), actif: true },
        { prenom: ILike(`%${search}%`), actif: true },
        { telephone: ILike(`%${search}%`), actif: true },
        { email: ILike(`%${search}%`), actif: true },
      ],

      skip: (page - 1) * limit,
      take: limit,
      order: {
        nom: 'ASC',
      },
    });
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const client = await this.clientRepo.findOne({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Client ${id} introuvable`);
    }

    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    const client = await this.clientRepo.preload({
      id,
      ...updateClientDto,
    });

    if (!client) {
      throw new NotFoundException(`Client ${id} introuvable`);
    }

    return await this.clientRepo.save(client);
  }

  async remove(id: number) {
    const client = await this.findOne(id);

    if (!client) {
      throw new NotFoundException('Client introuvable');
    }
    await this.clientRepo.update(id, { actif: false });

    return {
      message: 'Client supprimé',
    };
  }
}
