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

  async findAll(page = 1, limit = 10, search = '', statutPaiement = '') {
    const qb = this.repo

      .createQueryBuilder('vente')

      .leftJoinAndSelect('vente.facturation', 'facturation')
      .leftJoinAndSelect('facturation.reservation', 'reservation')
      .leftJoinAndSelect('reservation.client', 'client')
      .leftJoinAndSelect('vente.produits', 'ligne')
      .leftJoinAndSelect('ligne.produitUnite', 'produitUnite')
      .leftJoinAndSelect('ligne.prestation', 'prestation')
      .leftJoinAndSelect('vente.paiements', 'paiement')

      .orderBy('vente.created_at', 'DESC');

    if (search.trim()) {
      qb.andWhere(
        `
      vente.numero LIKE :search
      OR client.nom LIKE :search
      OR client.prenom LIKE :search
      `,
        {
          search: `%${search}%`,
        },
      );
    }

    const all = await qb.getMany();

    const mapped = all.map((v) => {
      const montantPaye =
        v.paiements?.reduce((sum, p) => sum + Number(p.montant), 0) ?? 0;

      const total = Number(v.total);

      return {
        ...v,
        client: v.facturation?.reservation?.client ?? null,
        montantPaye,
        reste: total - montantPaye,
        statutPaiement:
          montantPaye >= total
            ? 'PAYE'
            : montantPaye > 0
              ? 'PARTIEL'
              : 'NON_PAYE',
      };
    });

    const filtered = statutPaiement
      ? mapped.filter((v) => v.statutPaiement === statutPaiement)
      : mapped;

    const total = filtered.length;
    const data = filtered.slice((page - 1) * limit, page * limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const vente = await this.repo.findOne({
      where: {
        id,
      },
      relations: {
        facturation: {
          reservation: {
            client: true,
          },
        },
        produits: {
          produitUnite: {
            produit: true,
          },
          prestation: true,
        },

        paiements: true,
      },
    });

    if (!vente) {
      throw new NotFoundException('Vente introuvable');
    }

    const montantPaye =
      vente.paiements?.reduce((sum, p) => sum + Number(p.montant), 0) ?? 0;

    return {
      ...vente,
      client: vente.facturation?.reservation?.client ?? null,
      montantPaye,
      reste: Number(vente.total) - montantPaye,
      statutPaiement:
        montantPaye >= Number(vente.total)
          ? 'PAYE'
          : montantPaye > 0
            ? 'PARTIEL'
            : 'NON_PAYE',
    };
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

  async cancelVente(venteId: number) {
    const vente = await this.repo.findOne({
      where: { id: venteId },
      relations: { produits: true },
    });

    if (!vente) throw new NotFoundException();

    for (const item of vente.produits) {
      const unit = await this.uniteRepo.findOne({
        where: {
          produit: { id: item.produitUnite?.id },
        },
      });

      if (!unit) throw new NotFoundException();
      unit.stock += item.quantite;
      await this.uniteRepo.save(unit);
    }

    // vente.statut = 'CANCELLED';
    return this.repo.save(vente);
  }

  async updatePaiement(id: number, montant: number) {
    const vente = await this.repo.findOneBy({
      id,
    });

    if (!vente) {
      throw new NotFoundException('Vente introuvable');
    }

    vente.montantPaye = Number(vente.montantPaye) + Number(montant);

    if (vente.montantPaye > vente.total) {
      vente.montantPaye = vente.total;
    }

    return this.repo.save(vente);
  }
}
