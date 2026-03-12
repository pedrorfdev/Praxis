export * from "./infra/db/connection"; 

import { schemas } from "./infra/schemas/index";
export { schemas as schema };

export * from "./domain/clinics";
export * from "./domain/patients";
export * from "./domain/sessions";

/**
 * Nota: No futuro, configuraremos os "Subpath Exports" no package.json
 * para que o Front-end possa importar apenas de "@praxis/core/domain"
 * sem carregar o código de banco de dados no bundle.
 */