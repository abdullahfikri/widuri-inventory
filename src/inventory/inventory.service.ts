import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import {
  CreateItemRequest,
  CreateItemResponse,
} from 'src/model/inventory.model';
import { Logger } from 'winston';
import { InventoryValidation } from './inventory.validation';
import { Utilities } from 'src/common/utilities';
import { Prisma } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async create(request: CreateItemRequest): Promise<CreateItemResponse> {
    this.logger.info(`Create new item ${JSON.stringify(request.name)}`);

    // validation request payload
    const createRequest: CreateItemRequest = this.validationService.validate(
      InventoryValidation.CREATE,
      request,
    );

    // Check name item duplicate
    const itemCount = await this.prismaService.item.count({
      where: {
        name: createRequest.name,
      },
    });

    if (itemCount != 0) {
      throw new HttpException('Name is already exist', 200);
    }

    const { variation, ...item } = request;

    // 1. Create an item that does not have any variants
    if (!item.variant) {
      const data = await this.prismaService.item.create({
        data: {
          name: item.name,
          description: item.description,
          price: Utilities.convertStringPriceToDecimal(item.price),
          stock: item.stock,
        },
      });

      return { ...data };
    }

    // 2. Create an item that does have any variants but not have subvariant
    if (item.variant && !item.subvariant) {
      const data = await this.prismaService.item.create({
        data: {
          name: item.name,
          description: item.description,
          price: Utilities.convertStringPriceToDecimal(item.price),
          stock: item.stock,
          variant: item.variant,
          variation: {
            createMany: {
              data: variation.map((variant) => {
                return {
                  name: variant.name,
                  price: Utilities.convertStringPriceToDecimal(variant.price),
                  stock: variant.stock,
                };
              }),
            },
          },
        },
        include: {
          variation: true,
        },
      });

      return { ...data };
    }

    // 3. Create an item that does have variants and have subvariant
    try {
      // Create transaction for consistency of creating object
      return await this.prismaService.$transaction(
        async (tx) => {
          // Create item
          const itemResult = await tx.item.create({
            data: {
              name: item.name,
              description: item.description,
              price: Utilities.convertStringPriceToDecimal(item.price),
              stock: item.stock,
              variant: item.variant,
              subvariant: item.subvariant,
            },
            select: {
              id: true,
              description: true,
              name: true,
              price: true,
              stock: true,
              subvariant: true,
              variant: true,
            },
          });

          // Create variants
          const variants = await tx.variation.createManyAndReturn({
            data: variation.map((variant) => ({
              item_id: itemResult.id,
              name: variant.name,
            })),
          });

          // Create subvariant
          const subVariantResult = await tx.subvariation.createManyAndReturn({
            data: variation.flatMap((variant) => {
              const { id } = variants.find((vari) => {
                return vari.name === variant.name;
              });

              const subvariant = variant.subvariation.map((subv) => ({
                name: subv.name,
                price: Utilities.convertStringPriceToDecimal(subv.price),
                stock: subv.stock,
                variation_id: id,
              }));

              return subvariant;
            }),
            include: {
              variation: true,
            },
          });

          // Create variant result and include all subvariant for return value
          const variantsResult = variants.map((vari) => {
            const subVariants = subVariantResult
              .filter((subVariant) => subVariant.variation_id === vari.id)
              .map((subVariant) => ({
                id: subVariant.id,
                name: subVariant.name,
                price: subVariant.price,
                stock: subVariant.stock,
                variation_id: subVariant.variation_id,
              }));

            return {
              id: vari.id,
              name: vari.name,
              price: vari.price,
              stock: vari.stock,
              item_id: vari.item_id,
              subvariation: subVariants,
            };
          });

          // Combine item result and include all variant result for return value
          const result = { ...itemResult, variation: variantsResult };

          return result;
        },
        {
          maxWait: 5000,
          timeout: 20000,
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      );
    } catch (error) {
      throw new HttpException(
        'Something went wrong, try again after a few second!',
        500,
      );
    }
  }

  async get(id) {
    const item = await this.prismaService.item.findUnique({
      where: {
        id,
      },
      include: {
        variation: {
          include: {
            subvariation: true,
          },
        },
      },
    });
  }
  async getMany() {}
  async update(request) {}
  async delete(id) {}
}
