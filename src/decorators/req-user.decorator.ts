import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Custom decorator to fetch req.user and pass it to the controller method
export const ReqUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
