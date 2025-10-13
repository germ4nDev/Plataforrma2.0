export class PTLModuloAP {
    constructor (
        public ModuloId?: number,
        public codigoAplicacion?: string,
        public codigoSuite?: string,
        public codigoModulo?: string,
        public codigoPadre?: string,
        public nombreModulo?: string,
        public descripcionModulo?: string,
        public rutaModulo?: string,
        public icon?: string,
        public estadoModulo?: boolean,
        public hijos?: boolean
   ) {}
}
