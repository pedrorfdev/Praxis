"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clinics = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.clinics = (0, pg_core_1.pgTable)("clinics", {
    id: (0, pg_core_1.uuid)().primaryKey().defaultRandom(),
    name: (0, pg_core_1.text)().notNull(),
    email: (0, pg_core_1.text)().notNull().unique(),
    password: (0, pg_core_1.text)().notNull(),
    slug: (0, pg_core_1.text)().notNull().unique(),
    createdAt: (0, pg_core_1.timestamp)().defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)().defaultNow().notNull(),
});
//# sourceMappingURL=clinics.js.map