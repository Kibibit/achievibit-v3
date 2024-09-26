import { makeBadge } from 'badge-maker';

import { Injectable } from '@nestjs/common';

@Injectable()
export class ShieldsService {
  generate(
    label: string,
    message: string,
    color: string = 'brightgreen'
  ) {
    const format = { label, message, color };

    try {
      const svg = makeBadge(format);

      return svg;
    } catch (error) {
      // ValidationError: Field `message` is required
      console.log(error);
    }
  }
}
