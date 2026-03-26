import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
export const ActiveClinic = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()

    return request.user?.clinicId
  },
)
