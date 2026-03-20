"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = exports.db = exports.sql = void 0;
const postgres_1 = require("postgres");
const postgres_js_1 = require("drizzle-orm/postgres-js");
const index_1 = require("../schemas/index");
Object.defineProperty(exports, "schema", { enumerable: true, get: function () { return index_1.schemas; } });
const connectionString = "postgresql://admin:password123@localhost:5432/praxis_db";
exports.sql = (0, postgres_1.default)(connectionString);
exports.db = (0, postgres_js_1.drizzle)(exports.sql, {
    schema: index_1.schemas,
    casing: "snake_case"
});
//# sourceMappingURL=connection.js.map