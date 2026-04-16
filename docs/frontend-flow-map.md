# Frontend Flow Map

## Scope

Mapeamento das rotas do `apps/web/src/app` para guiar o fechamento da fase de frontend com mocks padronizados.

## Dashboard routes

| Route | Status | Priority | Notes |
| --- | --- | --- | --- |
| `/` | parcial | alta | Dashboard base pronto, precisa validar estados de dados reais |
| `/patients` | parcial | alta | Já lista dados, agora via service unificado (`listPatients`) |
| `/patients/new` | parcial | alta | Fluxo de criação existe e usa schema compartilhado |
| `/patients/[id]/edit` | parcial | alta | Alinhado para `PATCH`, depende de QA visual final |
| `/patients/[id]` | mock incompleto | média | Visão geral depende de dados reais por paciente |
| `/patients/[id]/timeline` | parcial | média | Timeline já conectada ao service (`listEncounters`) |
| `/patients/[id]/anamnesis` | parcial | média | Persistência ainda local, integração posterior |
| `/encounters/new` | parcial | alta | Payload alinhado para `startAt`/`billingType` |
| `/caregivers` | parcial | média | Mock padronizado via service, backend ainda sem módulo |
| `/caregivers/new` | mock incompleto | média | Form já existe, sem persistência |
| `/caregivers/[id]` | mock incompleto | média | Tela com dados estáticos |
| `/caregivers/[id]/edit` | mock incompleto | média | Edição visual, falta persistência |
| `/activity` | parcial | baixa | Usa serviço unificado de atividades mockadas |
| `/settings` | mock incompleto | baixa | Ajustes finais de UX/configuração |

## Phase-1 exit criteria

- Nenhuma tela crítica usando mock inline.
- Todas as telas prioritárias usando fonte única de dados (`services/frontend-data`).
- Estados de carregamento e vazio presentes nas rotas de lista.
- Navegação principal completa sem depender do backend.
