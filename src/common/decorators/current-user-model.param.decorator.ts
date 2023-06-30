import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserModel = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return req?.user;
  },
);
