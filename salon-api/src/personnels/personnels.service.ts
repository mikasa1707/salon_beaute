import { Injectable } from '@nestjs/common';
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';

@Injectable()
export class PersonnelsService {
  create(createPersonnelDto: CreatePersonnelDto) {
    return 'This action adds a new personnel';
  }

  findAll() {
    return `This action returns all personnels`;
  }

  findOne(id: number) {
    return `This action returns a #${id} personnel`;
  }

  update(id: number, updatePersonnelDto: UpdatePersonnelDto) {
    return `This action updates a #${id} personnel`;
  }

  remove(id: number) {
    return `This action removes a #${id} personnel`;
  }
}
