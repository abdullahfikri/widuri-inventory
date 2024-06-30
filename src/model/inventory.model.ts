import { Prisma } from '@prisma/client';

interface SubVariation {
  id?: number;
  variation_id: number;
  name: string;
  stock: number;
  price: Prisma.Decimal | string;
}

interface Variation {
  id: number;
  item_id: number;
  name: string;
  stock?: number;
  price: Prisma.Decimal | string;
  subvariation?: SubVariation[];
}

export class CreateItemRequest {
  name: string;
  description: string;
  stock?: number;
  price?: string;
  variant?: string;
  subvariant?: string;
  variation?: [
    {
      name: string;
      stock?: number;
      price?: string;
      subvariation?: [
        {
          name: string;
          stock: number;
          price: string;
        },
      ];
    },
  ];
}

export class CreateItemResponse {
  id: number;
  name: string;
  description: string;
  stock?: number;
  price?: Prisma.Decimal | string;
  variant?: string;
  subvariant?: string;
  variation?: Variation[];
}

export class GetItemsWithPagination {
  page: string;
  pageSize: string;
}

export class GetItemsWithPaginationResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: CreateItemResponse[] | [];
}

export class UpdateSubVariation {
  id?: number;
  variation_id?: number;
  name?: string;
  stock?: number;
  price?: Prisma.Decimal | string;
}

export class UpdateVariation {
  id?: number;
  item_id?: number;
  name?: string;
  stock?: number;
  price?: Prisma.Decimal | string;
  subvariation?: SubVariation[];
}

export class UpdateItemRequest {
  name?: string;
  description?: string;
  stock?: number;
  price?: string;
  variant?: string;
  subvariant?: string;
  variation?: Variation[];
}
