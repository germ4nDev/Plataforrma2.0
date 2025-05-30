export class PTLAplicacion {
    constructor(
        public aplicacionId?: number,
        public codigoAplicacion?: string,
        public nombreAplicacion?: string,
        public descripcionAplicacion?: string,
        public estadoAplicacion?: boolean,
        public nomEstado?: string,
    ) {}
}
