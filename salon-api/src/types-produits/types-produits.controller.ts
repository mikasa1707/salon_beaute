import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TypesProduitsService } from './types-produits.service';
import { CreateTypesProduitDto } from './dto/create-types-produit.dto';
import { UpdateTypesProduitDto } from './dto/update-types-produit.dto';

@Controller('types-produits')
export class TypesProduitsController {
  constructor(private readonly typesProduitsService: TypesProduitsService) {}

  @Post()
  create(@Body() createTypesProduitDto: CreateTypesProduitDto) {
    return this.typesProduitsService.create(createTypesProduitDto);
  }

  @Get()
  findAll() {
    return this.typesProduitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typesProduitsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypesProduitDto: UpdateTypesProduitDto) {
    return this.typesProduitsService.update(+id, updateTypesProduitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typesProduitsService.remove(+id);
  }
}
