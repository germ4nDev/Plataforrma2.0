import { PTLAplicacionModel } from "./PTLAplicacion.model"
import { PTLModuloAP } from "./PTLModuloAP.model"
import { PTLSuiteAPModel } from "./PTLSuiteAP.model"

/* eslint-disable @typescript-eslint/no-explicit-any */
export class NavSettings {
    constructor (
        public aplicacion?: PTLAplicacionModel,
        public suite?: PTLSuiteAPModel,
        public modulo?: PTLModuloAP
    ) {}
 }
