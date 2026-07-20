import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { StocksService } from './stocks.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PersonnelRole } from 'src/personnels/entities/personnel.entity';
import { StockMovementFilterDto } from './dto/stock-movement-filter.dto';
import { StockConsumptionService } from './stock-consumption.service';
import { CreateStockEntryDto } from './dto/create-stock-entry.dto';
import type { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';

@Controller('stocks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StocksController {
  constructor(
    private readonly stocksService: StocksService,
    private readonly stocksMoveService: StockConsumptionService,
  ) {}

  @Post()
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  create(@Body() createStockDto: CreateStockDto) {
    return this.stocksService.create(createStockDto);
  }

  @Get()
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
    PersonnelRole.COIFFEUR,
    PersonnelRole.ESTHETICIEN,
  )
  findAll() {
    return this.stocksService.findAll();
  }

  @Get('move')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
    PersonnelRole.COIFFEUR,
    PersonnelRole.ESTHETICIEN,
  )
  findAllStockMove(@Query() dto: StockMovementFilterDto) {
    return this.stocksMoveService.findAll(dto);
  }

  @Get('moveproduct')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
    PersonnelRole.COIFFEUR,
    PersonnelRole.ESTHETICIEN,
  )
  findAllStockMoveByProduct(@Query() dto: StockMovementFilterDto) {
    return this.stocksMoveService.findAll(dto);
  }

  @Post('entry')
  @Roles(
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  entry(@Body() dto: CreateStockEntryDto, @Req() req: RequestWithUser) {
    return this.stocksMoveService.createEntry(dto, req.user.userId, req.user.email);
  }

  @Get(':id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
    PersonnelRole.COIFFEUR,
    PersonnelRole.ESTHETICIEN,
  )
  findOne(@Param('id') id: string) {
    return this.stocksService.findOne(+id);
  }

  @Patch(':id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  update(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
    return this.stocksService.update(+id, updateStockDto);
  }

  @Delete(':id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  remove(@Param('id') id: string) {
    return this.stocksService.remove(+id);
  }
}
