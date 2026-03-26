// apps/api/src/modules/health/health.controller.ts
import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { sql } from '@praxis/core/infra'
import { Public } from '../../common/decorators/public.decorator'

@ApiTags('System')
@Controller('health')
export class HealthController {
  @Public()
  @Get()
  @ApiOperation({
    summary: 'Verifica se a API e o Banco de Dados estão operacionais',
  })
  async check() {
    let dbStatus = 'up'
    let dbError = null

    try {
      await sql`SELECT 1`
    } catch (error: any) {
      dbStatus = 'down'
      dbError = error.message
    }

    return {
      status: dbStatus === 'up' ? 'ok' : 'error',
      info: {
        api: { status: 'up', uptime: process.uptime() },
        database: { status: dbStatus },
      },
      error: dbError ? { database: dbError } : {},
      details: {
        api: { status: 'up' },
        database: { status: dbStatus },
      },
    }
  }
}
