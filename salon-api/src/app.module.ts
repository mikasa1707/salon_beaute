import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { ProduitsModule } from './produits/produits.module';
import { MarquesModule } from './marques/marques.module';
import { TypesProduitsModule } from './types-produits/types-produits.module';
import { PersonnelsModule } from './personnels/personnels.module';
import { ReservationsModule } from './reservations/reservations.module';
import { PrestationsModule } from './prestations/prestations.module';
import { TypesPrestationsModule } from './types-prestations/types-prestations.module';
import { StocksModule } from './stocks/stocks.module';
import { InventairesModule } from './inventaires/inventaires.module';

@Module({
  imports: [ClientsModule, ProduitsModule, MarquesModule, TypesProduitsModule, PersonnelsModule, ReservationsModule, PrestationsModule, TypesPrestationsModule, StocksModule, InventairesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
