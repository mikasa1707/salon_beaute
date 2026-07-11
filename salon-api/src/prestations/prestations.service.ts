import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePrestationDto } from './dto/create-prestation.dto';
import { UpdatePrestationDto } from './dto/update-prestation.dto';
import { Prestation } from './entities/prestation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { Personnel } from 'src/personnels/entities/personnel.entity';

@Injectable()
export class PrestationsService {
  constructor(
    @InjectRepository(Prestation)
    private readonly repo: Repository<Prestation>,
    @InjectRepository(Personnel)
    private readonly personnelRepository: Repository<Personnel>,
  ) {}

  async create(createDto: CreatePrestationDto) {
    const { personnelIds, ...data } = createDto;

    const prestation = this.repo.create(data);

    if (personnelIds?.length) {
      prestation.personnels = await this.personnelRepository.findBy({
        id: In(personnelIds),
      });
    }

    return await this.repo.save(prestation);
  }

  async findAll(page = 1, limit = 10, search = '') {
    const [data, total] = await this.repo.findAndCount({
      where: [{ nom: ILike(`%${search}%`), actif: true }],
      relations: { typePrestation: true, personnels: true },

      skip: (page - 1) * limit,
      take: limit,
      order: {
        nom: 'ASC',
      },
    });
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const _data = await this.repo.findOne({
      where: { id },
      relations: { typePrestation: true, personnels: true },
    });

    if (!_data) {
      throw new NotFoundException(`Prestation ${id} introuvable`);
    }
    return _data;
  }

  async update(id: number, updateDto: UpdatePrestationDto) {
    const { personnelIds, ...data } = updateDto;

    const prestation = await this.repo.findOne({
      where: { id },
      relations: { typePrestation: true, personnels: true },
    });

    if (!prestation) {
      throw new NotFoundException('Prestation introuvable');
    }

    Object.assign(prestation, data);

    if (personnelIds !== undefined) {
      prestation.personnels = personnelIds.length
        ? await this.personnelRepository.findBy({
            id: In(personnelIds),
          })
        : [];
    }

    return await this.repo.save(prestation);
  }

  async remove(id: number) {
    const prestation = await this.findOne(id);

    if (!prestation) {
      throw new NotFoundException('Prestation introuvable');
    }
    await this.repo.update(id, { actif: false });

    return {
      message: 'Prestation supprimé',
    };
  }
}
