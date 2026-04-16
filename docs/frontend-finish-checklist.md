# Frontend Finish Checklist

## UX baseline

- [x] Fonte única para dados mockados (`apps/web/src/services/frontend-data.ts`)
- [x] Entidades mockadas tipadas (`apps/web/src/mocks/entities.ts`)
- [x] Mocks centralizados (`apps/web/src/mocks/data.ts`)
- [x] `patients` consumindo serviço unificado
- [x] `caregivers` consumindo serviço unificado
- [x] `activity` consumindo serviço unificado
- [x] `timeline` consumindo serviço unificado
- [ ] Estados vazios refinados em todas as telas de detalhe
- [ ] Revisão visual completa (spacing, tipografia, responsividade)

## Contract alignment

- [x] Base URL frontend alinhada ao prefixo Nest (`/api`)
- [x] Atualização de sessão via `PATCH`
- [x] Payload de sessão alinhado para `startAt` e `billingType`
- [x] Tipos do controller de pacientes corrigidos (`CreatePatientInput` e `UpdatePatientInput`)
- [ ] Validar contratos restantes de `caregivers` (módulo não implementado no backend)
- [ ] Validar fluxo completo de autenticação no frontend
