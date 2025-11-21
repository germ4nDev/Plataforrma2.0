import { PTLRoleAPModel } from "./PTLRoleAP.model";
import { PTLSuscriptorModel } from "./PTLSuscriptor.model";
import { PTLUsuarioModel } from "./PTLUsuario.model";

/* eslint-disable @typescript-eslint/no-explicit-any */
export class CurrentUserModel {
    constructor (
        public ok?: boolean,
        public token?: string,
        public usuario?: PTLUsuarioModel,
        public roles?: PTLRoleAPModel[],
        public suscriptor?: PTLSuscriptorModel
    ) {}
 }
