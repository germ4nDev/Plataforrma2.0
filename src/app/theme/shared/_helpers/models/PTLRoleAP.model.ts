export class PTLRoleAPModel {
  constructor(
    public roleId?: number,
    public aplicacionId?: number,
    public codigoAplicacion?: string,
    public nombreAplicacion?: string,
    public suiteId?: number,
    public codigoSuite?: string,
    public nombreSuite?: string,
    public nombreRole?: string,
    public descripcionRole?: string,
    public estadoRole?: number,
    public nomEstado?: string,
    public checked?: boolean
  ) {}
}
