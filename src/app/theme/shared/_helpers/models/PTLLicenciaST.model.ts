export class PTLLcenciaST {
  constructor(
    public licenciaId: number,
    public suscriptorId: number,
    public aplicacionId: number,
    public nombreLicencia: string,
    public descripcionLicencia: string,
    public estadoLicencia: boolean,
    public fechaVencimiento: Date,
    public codigoUsuarioCreacion?: string,
    public fechaCreacion?: string,
    public codigoUsuarioModificacion?: string,
    public fechaModificacion?: string
  ) {}
}
