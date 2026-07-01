import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  async findAll() {
    return await this.clientRepo.find();
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
    return await this.clientRepo.remove(client);
  }
}
