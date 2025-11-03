export class PTLVersionAP {
  constructor(
    public versionId?: number,
    public fechaVersion?: Date,
    public codigoAplicacion?: string,
    public codigoVersion?: string,
    public nombreVersion?: string,
    public descripcionVersion?: string,
    public estadoVersion?: boolean,
    public codigoUsuarioCreacion?: string,
    public fechaCreacion?: string,
    public codigoUsuarioModificacion?: string,
    public fechaModificacion?: string
  ) {}
}
