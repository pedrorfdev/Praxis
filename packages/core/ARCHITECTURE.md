# Core Boundaries

## Goal

Manter `@praxis/core` como pacote único, com fronteiras explícitas para reduzir acoplamento entre contrato de domínio e persistência.

## Domain (`src/domain`)

- Define schemas Zod e tipos públicos compartilháveis entre frontend e backend.
- Exporta contratos por `src/domain/contracts/index.ts`.
- Não deve importar `drizzle`, conexão de banco ou detalhes de infraestrutura.

## Infra (`src/infra`)

- Define conexão de banco e schema de persistência (`drizzle`).
- Exporta camada de persistência por `src/infra/persistence/index.ts`.
- Pode depender de `domain` apenas para validações/contratos necessários.

## Public exports

- `src/index.ts` agrega `domain` e `infra` para manter compatibilidade.
- Entradas específicas continuam válidas por `@praxis/core/domain` e `@praxis/core/infra`.
