export class PTLPaqueteModel {
  constructor(
    public paqueteId?: number,
    public nombrePaquete?: string,
    public codigoPaquete?: string,
    public descripcionPaquete?: string,
    public acuerdoLicencia?: string,
    public imagenPaquete?: string,
    public iconoPaquete?: string,
    public colorPaquete?: string,
    public costoPquete?: number,
    public precioPaquete?: number,
    public promocion?: boolean,
    public precioPromocion?: number,
    public estadoPaquete?: boolean
  ) {}
}
