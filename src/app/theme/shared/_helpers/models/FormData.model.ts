/* eslint-disable @typescript-eslint/no-explicit-any */
export class FormDataModel {
    constructor (
        public codigoAplicacion?: string,
        public codigoSuite?: string,
        public codigoModulo?: string,
        public data?: any,
        public usuarioCreacion?: string,
        public fechaCreacion?: Date,
        public usuarioModificacion?: string,
        public fechaModificacion?: Date
   ) {}
}
