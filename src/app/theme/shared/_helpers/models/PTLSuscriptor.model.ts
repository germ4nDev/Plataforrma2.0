export class PTLSuscriptorModel {
  constructor(
    public suscriptorId?: number,
    public identificacionSuscriptor?: number,
    public nombreSuscriptor?: string,
    public descripcionSuscriptor?: string,
    public estadoSuscriptor?: boolean,
    public nomEstado?: string
  ) {}
}
