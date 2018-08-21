'use strict'

var STATUS_PEDIDO = {
		INDEFINIDO : 0,
		CRIADO : 1,
		SALVO : 2,
		ENVIADO : 3,
		NEGADO : 4,
		COLOCADO : 5,
		CANCELADO : 6,
}

var NETWORK_STATUS = {
	OFFLINE: 0,
	ONLINE: 1
}

var NETWORK = {
	STATUS: NETWORK_STATUS.OFFLINE
}

var Connection = {
	UNKNOWN: 0,
	NONE: 1
}

var DATABASE_STATUS = {
	OFFLINE: 0,
	ONLINE: 1
}

var DATABASE = {
	NAME: 'flechavendaslocal.db',
	HASH: '98288f2f1127c95121bcb51c897251c9',
	STATUS: DATABASE_STATUS.ONLINE,
	ID: 115478445
}

var CALLRESULT = {
	OK: 0,
	ERROR: -1,
	UNKNOWN: -2,
}

var TIMEOUT = 60000

var STORAGE_ITEM = {
  INDUSTRIAS_USUARIO: 1,
	CLIENTES_USUARIO: 2,
}

var LISTA_SIMNAO = [
	{value: false, text: 'Não'},
	{value: true, text: 'Sim'}
]

var LISTA_CARGA = [
	{value: 1, text: 'Batida'},
	{value: 2, text: 'Paletizado'}
]

var PAGINACAO = {
	PEDIDO : {
		PAGE_SIZE : 20,
		NEW_PAGE : 1
	}
}

var IMAGE_FILE_TYPE = [
	'image/png',
	'image/jpeg'
]

var DOCUMENT_FILE_TYPE = [
	'application/pdf',
	'text/plain',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/msword'
]