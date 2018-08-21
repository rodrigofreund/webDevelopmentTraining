class PedidoDto {
  constructor(idUsuario, dataEntrega) {
    this.id = undefined
    this.idIndustria= undefined
    this.idCliente= undefined
    this.idTabela= undefined
    this.idIndustriaPrazo= undefined
    this.proposta= undefined
    this.carga= undefined
    this.dataEntrega= dataEntrega
    this.dataPedido= undefined
    this.idUsuario= idUsuario
    this.statusPedido= STATUS_PEDIDO.INDEFINIDO
    this.codigoPedidoIndustria= undefined
    this.alterado= undefined
    this.itensPedido= []
    this.observacoesPedidoDto= []
    this.usuario= {}
    this.industria= {}
    this.cliente= {}
    this.tabela= {}
    this.industriaPrazo= {}
  }
}
