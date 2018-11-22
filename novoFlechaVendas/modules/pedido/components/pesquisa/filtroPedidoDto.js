class filtroPedidoDto {
  constructor(auth, status) {
    this.idIndustria = null,
    this.idUsuario = auth.administrador ? null : auth.id,
    this.idStatus = status,
    this.dtInicio = null,
    this.dtFim = null,
    this.idCliente = null,
    this.newPage = PAGINACAO.PEDIDO.NEW_PAGE,
    this.pageSize = PAGINACAO.PEDIDO.PAGE_SIZE
  }
};