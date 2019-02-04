import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-meu-componente2',
  templateUrl: './meu-componente2.component.html',
  styleUrls: ['./meu-componente2.component.css']
})
export class MeuComponente2Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  nome = 'Rodrigo Freund'

  isInvisible = false

  myList = [0,1,2,3,4,5,6,7,8,9]

  option = null

  Aluno =  {
    Dados: {
      nome: 'Nome do aluno'
    }
  }

}
