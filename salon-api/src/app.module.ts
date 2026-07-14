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
import { DashboardModule } from './dashboard/dashboard.module';
import { CheckoutModule } from './checkout/checkout.module';
import { CashRegisterModule } from './cash-register/cash-register.module';
import { PlanningModule } from './planning/planning.module';
import { AuditLogModule } from './audit-log/audit-log.module';

import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core/constants';
import { PrestationProduitsModule } from './prestations_produits/prestations-produits.module';
import { PrestationsRecettesModule } from './prestations-recettes/prestations-recettes.module';

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

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

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
    PlanningModule,
    AuditLogModule,
    PrestationProduitsModule,
    PrestationsRecettesModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
