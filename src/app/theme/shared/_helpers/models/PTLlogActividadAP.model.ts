export class PTLLogActividadAP {
    constructor (
        public logId : number,
        public aplicacionId : number,
        public fechaLog : Date,
        public descripcionLog : string,
        public codigoError : number
    ) {}
}
