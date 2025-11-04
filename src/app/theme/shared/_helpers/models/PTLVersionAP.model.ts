import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

export class PTLVersionAP {
  constructor(
    public versionId?: number,
    public fecha?: NgbDateStruct,
    public fechaVersion?: string,
    public codigoVersion?: string,
    public codigoAplicacion?: string,
    public nombreVersion?: string,
    public version?: string,
    public descripcionVersion?: string,
    public estadoVersion?: boolean,
    public codigoUsuarioCreacion?: string,
    public fechaCreacion?: string,
    public codigoUsuarioModificacion?: string,
    public fechaModificacion?: string
  ) {}
}
