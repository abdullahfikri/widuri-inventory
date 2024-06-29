import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [ConfigModule.forRoot(), CommonModule, InventoryModule],
})
export class AppModule {}
