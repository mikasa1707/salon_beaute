import { Injectable } from '@nestjs/common';
import { CreateTypesProduitDto } from './dto/create-types-produit.dto';
import { UpdateTypesProduitDto } from './dto/update-types-produit.dto';

@Injectable()
export class TypesProduitsService {
  create(createTypesProduitDto: CreateTypesProduitDto) {
    return 'This action adds a new typesProduit';
  }

  findAll() {
    return `This action returns all typesProduits`;
  }

  findOne(id: number) {
    return `This action returns a #${id} typesProduit`;
  }

  update(id: number, updateTypesProduitDto: UpdateTypesProduitDto) {
    return `This action updates a #${id} typesProduit`;
  }

  remove(id: number) {
    return `This action removes a #${id} typesProduit`;
  }
}
