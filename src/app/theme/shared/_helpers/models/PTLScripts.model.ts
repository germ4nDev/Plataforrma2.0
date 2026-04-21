/*
    Autor: Juan Valencia
*/

export class PTLScriptsModel {
  constructor(
    public scriptId?: number,
    public codigoScript?: string,
    public nombreScript?: string,
    public descripcionScript?: string,
    public codigoAplicacion?: string,
    public codigoTipo?: string,
    public estadoScript?: boolean,
    public codigoUsuarioCreacion?: string,
    public fechaCreacion?: string,
    public codigoUsuarioModificacion?: string,
    public fechaModificacion?: string
  ) {}
}
