export class PTLTextoID {
  constructor(
    public textoId: number,
    public idiomaId: number,
    public anclaTexto: string,
    public textoValor: string,
    public estadoTexto: boolean,
    public codigoUsuarioCreacion?: string,
    public fechaCreacion?: string,
    public codigoUsuarioModificacion?: string,
    public fechaModificacion?: string
  ) {}
}
