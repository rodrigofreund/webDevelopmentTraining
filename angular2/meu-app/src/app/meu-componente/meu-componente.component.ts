import  {Component} from '@angular/core';

// DECORATOR - Permite que passamos comportamentos para a classe.
@Component({
    // Meta dados
    selector: 'meu-componente-component', //Tag do componente
    template: `<div>Meu componente</div>`
})

// PERMITE USAR A CLASSE EM OUTRO LUGAR
export class MeuComponenteComponent {

}