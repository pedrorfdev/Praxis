import { Controller, Get, Inject } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { Public } from '../../common/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DRIZZLE } from '../../infra/database/database.module'; // Ou como você nomeou seu token
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';

@ApiTags('System')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    @Inject(DRIZZLE) private db: NodePgDatabase,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Verifica se a API e o Banco de Dados estão operacionais' })
  @ApiResponse({ 
    status: 200, 
    description: 'Sistema saudável',
    schema: {
      example: {
        status: "ok",
        info: { database: { status: "up" }, api: { status: "up" } },
        error: {},
        details: { database: { status: "up" }, api: { status: "up" } }
      }
    }
  })
  check() {
    return this.health.check([
      () => ({ api: { status: 'up', uptime: process.uptime() } }),
      
      async () => {
        try {
          await this.db.execute(sql`SELECT 1`);
          return { database: { status: 'up' } };
        } catch (error: any) {
          return { database: { status: 'down', message: error.message } };
        }
      },
    ]);
  }
}