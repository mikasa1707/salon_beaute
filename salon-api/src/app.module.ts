import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';
import { VentesModule } from './ventes/ventes.module';
import { VenteProduitsModule } from './vente-produits/vente-produits.module';
import { PaiementsModule } from './paiements/paiements.module';
import { FacturationsModule } from './facturations/facturations.module';
import { PlanningService } from './planning/planning.service';
import { PlanningController } from './planning/planning.controller';
import { DashboardModule } from './dashboard/dashboard.module';
import { CheckoutModule } from './checkout/checkout.module';
import { CashRegisterModule } from './cash-register/cash-register.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),

    ClientsModule,
    ProduitsModule,
    MarquesModule,
    TypesProduitsModule,
    PersonnelsModule,
    ReservationsModule,
    PrestationsModule,
    TypesPrestationsModule,
    StocksModule,
    InventairesModule,
    SeedModule,
    AuthModule,
    VentesModule,
    VenteProduitsModule,
    PaiementsModule,
    FacturationsModule,
    DashboardModule,
    CheckoutModule,
    CashRegisterModule,
  ],

  controllers: [AppController, PlanningController],
  providers: [AppService, PlanningService],
})
export class AppModule {}
