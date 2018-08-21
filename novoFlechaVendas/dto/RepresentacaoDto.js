class RepresentacaoDto {
  constructor(usuarioDto, industriaDto) {
    this.id = null
    this.idIndustria = industriaDto.id
    this.idUsuario = usuarioDto.id
    this.nomeIndustria = industriaDto.nome
    this.nomeUsuario = usuarioDto.nome
    this.ativo = true
  }
}