export class PTLLogActividadAPModel {
    constructor (
        public logId? : number,
        public codigoAplicacion? : string,
        public codigoSuite? : string,
        public codigoModulo? : string,
        public codigoSuscriptor? : string,
        public fechaLog? : string,
        public descripcionLg? : string,
        public codigoRespuesta? : number,
        public codigoUsuarioCreacion?: string,
        public fechaCreacion?: string,
    ) {}
}
