import { Injectable } from '@nestjs/common';
import { CreateMarqueDto } from './dto/create-marque.dto';
import { UpdateMarqueDto } from './dto/update-marque.dto';

@Injectable()
export class MarquesService {
  create(createMarqueDto: CreateMarqueDto) {
    return 'This action adds a new marque';
  }

  findAll() {
    return `This action returns all marques`;
  }

  findOne(id: number) {
    return `This action returns a #${id} marque`;
  }

  update(id: number, updateMarqueDto: UpdateMarqueDto) {
    return `This action updates a #${id} marque`;
  }

  remove(id: number) {
    return `This action removes a #${id} marque`;
  }
}
