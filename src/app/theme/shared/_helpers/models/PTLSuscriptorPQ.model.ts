export class PTLSuscriptorPQ {
  constructor(
    public suscriptoPaqueteId?: number,
    public codigoSuscriptor?: string,
    public paqueteId?: number,
    public fechaInicio?: Date,
    public fechaVencimiento?: Date,
    public cdigoLicencia?: string,
    public conexionId?: number,
    public estadoLicencia?: boolean
  ) {}
}
