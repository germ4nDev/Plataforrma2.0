export class PTLGaleria {
  constructor(
    public galeriaId?: number,
    public codigoGaleria?: string,
    public codigoTipo?: string,
    public codigoFormato?: string,
    public nombreGaleria?: string,
    public descripcionGaleria?: string,
    public imagenGaleria?: string,
    public estadoGaleria?: boolean,
    public codigoUsuarioCreacion?: string,
    public fechaCreacion?: string,
    public codigoUsuarioModificacion?: string,
    public fechaModificacion?: string
  ) {}
}
