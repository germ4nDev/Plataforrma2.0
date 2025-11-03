export class PTLSuscriptorModel {
  constructor(
    public suscriptorId?: number,
    public identificacion?: number,
    public codigoSuscriptor?: string,
    public nombreSuscriptor?: string,
    public descripcionSuscriptor?: string,
    public estadoSuscriptor?: boolean,
    public nomEstado?: string,
    public codigoUsuarioCreacion?: string,
    public fechaCreacion?: string,
    public codigoUsuarioModificacion?: string,
    public fechaModificacion?: string
  ) {}
}
