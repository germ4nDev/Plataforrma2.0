export class PTLTicketAPModel {
  constructor(
    public ticketId?: number,
    public aplicacionId?: number,
    public nombreTicket?: string,
    public descripcionTicket?: string,
    public estadoTicket?: boolean,
    public usuarioSenderId?: number,
    public nomEstado?: string,
    public nomAplicacion?: string,
    public codigoUsuarioCreacion?: string,
    public fechaCreacion?: string,
    public codigoUsuarioModificacion?: string,
    public fechaModificacion?: string
  ) {}
}
