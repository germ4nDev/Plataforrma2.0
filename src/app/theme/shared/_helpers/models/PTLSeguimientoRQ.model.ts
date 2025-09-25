export class PTLSeguimientoRQModel {
  constructor(
    public seguimientoId?: number,
    public requerimientoId?: number,
    public nombreSeguimiento?: string,
    public descripcionSeguimiento?: string,
    public estadoSeguimiento?: string,
    public estadoRequerimiento?: string,
    public nomEstado?: string,
    public nomRequerimiento?: string
  ) {}
}
