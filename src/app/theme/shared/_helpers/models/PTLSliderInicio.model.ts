export class PTLSlierInicioModel {
  constructor(
    public sliderId?: number,
    public nombreSlider?: string,
    public urlSlider?: string,
    public imageSlider?: string,
    public descripcionSlider?: string,
    public nomEstado?: string,
    public estadoSlider?: boolean,
    public codigoUsuarioCreacion?: string,
    public fechaCreacion?: string,
    public codigoUsuarioModificacion?: string,
    public fechaModificacion?: string
  ) {}
}
