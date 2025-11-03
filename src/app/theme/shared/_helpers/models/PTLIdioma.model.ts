export class PTLIdioma {
  constructor(
    public idiomaId: number,
    public siglaIdioma: string,
    public nombreIdioma: string,
    public flagIdioma: string,
    public estadoIdioma: boolean,
    public codigoUsuarioCreacion?: string,
    public fechaCreacion?: string,
    public codigoUsuarioModificacion?: string,
    public fechaModificacion?: string
  ) {}
}
