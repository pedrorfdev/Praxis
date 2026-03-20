"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = void 0;
const clinics_1 = require("./clinics");
const patients_1 = require("./patients");
const sessions_1 = require("./sessions");
exports.schemas = {
    clinics: clinics_1.clinics,
    patients: patients_1.patients,
    sessions: sessions_1.sessions,
    sessionStatusEnum: sessions_1.sessionStatusEnum
};
//# sourceMappingURL=index.js.map