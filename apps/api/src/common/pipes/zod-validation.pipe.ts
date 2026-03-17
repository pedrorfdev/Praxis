import { BadRequestException, type PipeTransform } from "@nestjs/common";

import { ZodType } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value)
      return parsedValue
    } catch (error) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: error.errors.map((err: any) => ({
          path: err.path.join('.'),
          message: err.message
        }))
      })
    }
  }
}