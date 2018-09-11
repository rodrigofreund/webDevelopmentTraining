'use strict';

const STATUS_PEDIDO = {
	INDEFINIDO: 0,
	CRIADO: 1,
	SALVO: 2,
	ENVIADO: 3,
	NEGADO: 4,
	COLOCADO: 5,
	CANCELADO: 6,
}

const NETWORK_STATUS = {
	OFFLINE: 0,
	ONLINE: 1
}

const NETWORK = {
	STATUS: NETWORK_STATUS.OFFLINE
}

const Connection = {
	UNKNOWN: 0,
	NONE: 1
}

const DATABASE_STATUS = {
	OFFLINE: 0,
	ONLINE: 1
}

const DATABASE = {
	NAME: 'flechavendaslocal.db',
	HASH: '98288f2f1127c95121bcb51c897251c9',
	STATUS: DATABASE_STATUS.ONLINE,
	ID: 115478445
}

const CALLRESULT = {
	OK: 0,
	ERROR: -1,
	UNKNOWN: -2,
}

const TIMEOUT = 60000

const STORAGE_ITEM = {
	INDUSTRIAS_USUARIO: 1,
	CLIENTES_USUARIO: 2,
}

const LISTA_SIMNAO = [
	{ value: false, text: 'Não' },
	{ value: true, text: 'Sim' }
]

const LISTA_CARGA = [
	{ value: 1, text: 'Batida' },
	{ value: 2, text: 'Paletizado' }
]

const PAGINACAO = {
	PEDIDO: {
		PAGE_SIZE: 20,
		NEW_PAGE: 1
	}
}

const IMAGE_FILE_TYPE = [
	'image/png',
	'image/jpeg'
]

const DOCUMENT_FILE_TYPE = [
	'application/pdf',
	'text/plain',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/msword'
]

const ENTER_KEY_CODE = 13;

const PEDIDO_PROPOSTA = 1;
