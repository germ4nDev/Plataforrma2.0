export class PTLItemPaquete {
    constructor (
        public itemId : number,
        public codigoPaquete : string,
        public codigoValor : string,
        public descripcionItem : string,
        public cantidad : number,
        public valorUnitario : number,
        public valorTotal : number,
        public valoresAdicionales : number,
        public estadoItem : boolean
   ) {}
}
