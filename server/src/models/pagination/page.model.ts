import { IsArray } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { PageMetaModel } from './page-meta.model';

export class PageModel<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: () => PageMetaModel })
  readonly meta: PageMetaModel;

  constructor(data: T[], meta: PageMetaModel) {
    this.data = data;
    this.meta = meta;
  }
}
