import { Module } from '@nestjs/common';

import { ShieldsService } from './shields.service';

@Module({
  providers: [ ShieldsService ],
  exports: [ ShieldsService ]
})
export class ShieldsModule {}
