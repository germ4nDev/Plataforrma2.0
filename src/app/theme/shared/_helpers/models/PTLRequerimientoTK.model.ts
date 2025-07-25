export class PTLRequerimientoTKModel {
  constructor(
    public requerimientoId?: number,
    public ticketId?: number,
    public nombreRequerimiento?: string,
    public descripcionRequerimiento?: string,
    public estadoRequerimiento?: string,
    public nomEstado?: string
    // public codigoError? : string
  ) {}
}
