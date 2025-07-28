export class PTLSuscriptoresPQModelo {
  constructor(
    public suscriptoPaqueteId?: number,
    public codigoSuscriptor?: string,
    public paqueteId?: number,
    public conexionId?: number,
    public fechaInicio?: Date,
    public fechaVencimiento?: Date,
    public codigoLicencia?: string,
    public estadoLicencia?: boolean
  ) {}
}
