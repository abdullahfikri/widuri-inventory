import { Body, Controller, Inject, Post } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { WebResponse } from 'src/model/web.model';
import {
  CreateItemRequest,
  CreateItemResponse,
} from 'src/model/inventory.model';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('/api/inventory')
export class InventoryController {
  constructor(
    private inventoryService: InventoryService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  @Post('/create')
  async create(
    @Body() request: CreateItemRequest,
  ): Promise<WebResponse<CreateItemResponse>> {
    const data = await this.inventoryService.create(request);

    return { data: { ...data } };
  }
}
