import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Vente } from './entities/vente.entity';
import { CreateVenteDto } from './dto/create-vente.dto';
import { UpdateVenteDto } from './dto/update-vente.dto';
import { Facturation } from 'src/facturations/entities/facturation.entity';
import { ProduitUnite } from 'src/produits/entities/produit_unites.entity';
import { VenteProduit } from 'src/vente-produits/entities/vente-produit.entity';

@Injectable()
export class VentesService {
  constructor(
    @InjectRepository(Vente)
    private readonly repo: Repository<Vente>,

    @InjectRepository(Facturation)
    private readonly factureRepo: Repository<Facturation>,

    @InjectRepository(ProduitUnite)
    private readonly uniteRepo: Repository<ProduitUnite>,

    @InjectRepository(VenteProduit)
    private readonly venteProduitRepo: Repository<VenteProduit>,
  ) {}

  async create(createDto: CreateVenteDto) {
    const _data = this.repo.create(createDto);
    return await this.repo.save(_data);
  }

  async findAll() {
    return await this.repo.find();
  }

  async findOne(id: number) {
    const _data = await this.repo.findOne({
      where: { id },
    });

    if (!_data) {
      throw new NotFoundException(`Vente ${id} introuvable`);
    }
    return _data;
  }

  async update(id: number, updateDto: UpdateVenteDto) {
    const _data = await this.repo.preload({
      id,
      ...updateDto,
    });

    if (!_data) {
      throw new NotFoundException(`Vente ${id} introuvable`);
    }

    return await this.repo.save(_data);
  }

  async remove(id: number) {
    const _data = await this.findOne(id);
    return await this.repo.remove(_data);
  }

  // async convertFactureToVente(factureId: number) {
  //   const facture = await this.factureRepo.findOne({
  //     where: { id: factureId },
  //     relations: { items: { produitUnite: true }, client: true },
  //   });

  //   if (!facture) throw new NotFoundException();

  //   if (facture.status === FacturationStatus.CANCELLED) {
  //     throw new ConflictException('Facture annulée');
  //   }

  //   if (facture.status === FacturationStatus.PAID) {
  //     throw new ConflictException('Déjà convertie');
  //   }

  //   const vente = this.repo.create({
  //     reservation: facture.reservation,
  //     total: facture.total,
  //     total_produits: 0,
  //     total_prestations: facture.total,
  //     remise: 0,
  //   });

  //   const savedVente = await this.repo.save(vente);

  //   let totalProduits = 0;

  //   for (const item of facture.items) {
  //     const produitUnite = item.produitUnite;

  //     const totalLine = item.prix_unitaire * item.quantite;
  //     totalProduits += totalLine;

  //     // 🔥 STOCK DECREMENT
  //     if (produitUnite.stock < item.quantite) {
  //       throw new ConflictException(
  //         `Stock insuffisant pour ${produitUnite.nom}`,
  //       );
  //     }

  //     produitUnite.stock -= item.quantite;
  //     await this.uniteRepo.save(produitUnite);

  //     // 💰 VenteProduit
  //     await this.venteProduitRepo.save({
  //       vente: savedVente,
  //       produit: produitUnite.produit,
  //       quantite: item.quantite,
  //       prix_unitaire: item.prix_unitaire,
  //       total: totalLine,
  //     });
  //   }

  //   savedVente.total_produits = totalProduits;
  //   savedVente.total = totalProduits + facture.total;

  //   await this.repo.save(savedVente);

  //   facture.status = FacturationStatus.PAID;
  //   await this.factureRepo.save(facture);

  //   return savedVente;
  // }

  async cancelVente(venteId: number) {
    const vente = await this.repo.findOne({
      where: { id: venteId },
      relations: { produits: true },
    });

    if (!vente) throw new NotFoundException();

    for (const item of vente.produits) {
      const unit = await this.uniteRepo.findOne({
        where: {
          produit: { id: item.produit.id },
        },
      });

      if (!unit) throw new NotFoundException();
      unit.stock += item.quantite;
      await this.uniteRepo.save(unit);
    }

    // vente.statut = 'CANCELLED';
    return this.repo.save(vente);
  }
}
