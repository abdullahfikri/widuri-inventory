import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { WebResponse } from 'src/model/web.model';
import {
  CreateItemRequest,
  CreateItemResponse,
  GetItemsWithPagination,
  GetItemsWithPaginationResponse,
} from 'src/model/inventory.model';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('/v1/inventory')
export class InventoryController {
  constructor(
    private inventoryService: InventoryService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  @Post()
  async create(
    @Body() request: CreateItemRequest,
  ): Promise<WebResponse<CreateItemResponse>> {
    const result = await this.inventoryService.create(request);

    return { data: result };
  }

  @Get(':id')
  async getItemById(
    @Param() params: { id: string },
  ): Promise<WebResponse<CreateItemResponse>> {
    const result = await this.inventoryService.getItemById(params.id);

    return { data: result };
  }

  @Get()
  async getItemsWithPagination(
    @Query() request: GetItemsWithPagination,
  ): Promise<GetItemsWithPaginationResponse> {
    const result = await this.inventoryService.getItemsWithPaggination(request);

    return result;
  }

  @Delete(':id')
  async deleteItemById(@Param() params: { id: string }): Promise<any> {
    const result = await this.inventoryService.deleteItemById(params.id);

    return {
      data: result,
    };
  }
}
