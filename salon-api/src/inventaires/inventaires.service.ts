import { Injectable } from '@nestjs/common';
import { CreateInventaireDto } from './dto/create-inventaire.dto';
import { UpdateInventaireDto } from './dto/update-inventaire.dto';

@Injectable()
export class InventairesService {
  create(createInventaireDto: CreateInventaireDto) {
    return 'This action adds a new inventaire';
  }

  findAll() {
    return `This action returns all inventaires`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inventaire`;
  }

  update(id: number, updateInventaireDto: UpdateInventaireDto) {
    return `This action updates a #${id} inventaire`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventaire`;
  }
}
