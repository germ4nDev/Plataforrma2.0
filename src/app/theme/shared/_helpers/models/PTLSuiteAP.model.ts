export class PTLSuiteAPModel {
    constructor (
        public suiteId? : number,
        public codigoAplicacion? : string,
        public codigoSuite? : string,
        public nombreSuite? : string,
        public descripcionSuite? : string,
        public nomEstado? : string,
        public nomAplicacion? : string,
        public rutaInicio? : string,
        public estadoSuite? : boolean
   ) {}
}
