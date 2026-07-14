import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePrestationRecetteDto } from "./dto/create-prestations-recette.dto";
import { PrestationRecette } from "./entities/prestations-recette.entity";
import { UpdatePrestationsRecetteDto } from "./dto/update-prestations-recette.dto";

@Injectable()
export class PrestationsRecettesService {

  constructor(
    @InjectRepository(PrestationRecette)
    private repo: Repository<PrestationRecette>
  ) { }

  async create(dto: CreatePrestationRecetteDto) {
    const recette = this.repo.create({
      prestation: {
        id: dto.prestationId
      },
      produit: {
        id: dto.produitId
      },
      quantite: dto.quantite
    });
    return this.repo.save(recette);
  }

  async findByPrestation(prestationId: number) {
    return this.repo.find({
      where: {
        prestation: {
          id: prestationId
        }
      },
      relations: {
        produit: true
      }
    });
  }

  async remove(id: number) {
    return this.repo.delete(id);
  }

  async update(id: number, dto: UpdatePrestationsRecetteDto) {
    const recette = await this.repo.preload({
      id,
      ...dto,
    });

    if (!recette) {
      throw new NotFoundException(`Recette ${id} introuvable`);
    }

    return await this.repo.save(recette);
  }
}