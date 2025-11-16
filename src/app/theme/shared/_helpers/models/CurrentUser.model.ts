import { PTLSuscriptorModel } from "./PTLSuscriptor.model";
import { PTLUsuarioModel } from "./PTLUsuario.model";

/* eslint-disable @typescript-eslint/no-explicit-any */
export class CurrentUserModel {
    constructor (
        public ok?: boolean,
        public token?: string,
        public usuario?: PTLUsuarioModel,
        public suscriptor?: PTLSuscriptorModel
    ) {}
 }
