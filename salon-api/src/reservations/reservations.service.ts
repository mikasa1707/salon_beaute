import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly repo: Repository<Reservation>,
  ) {}

  async create(createDto: CreateReservationDto) {
    const _data = this.repo.create(createDto);
    return await this.repo.save(_data);
  }

  async findAll() {
    return await this.repo.find({
      relations: {
        client: true,
        prestations: {
          prestation: true,
        },
      },
    });
  }

  async findOne(id: number) {
    const _data = await this.repo.findOne({
      where: { id },
      relations: {
        client: true,
        prestations: {
          prestation: true,
        },
      },
    });

    if (!_data) {
      throw new NotFoundException(`Marque ${id} introuvable`);
    }
    return _data;
  }

  async update(id: number, updateDto: UpdateReservationDto) {
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
