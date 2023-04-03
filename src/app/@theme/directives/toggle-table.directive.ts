import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appToggleTable]'
})
export class ToggleTableDirective {

  constructor(
    private element: ElementRef
  ) { }

  // get event checkbox
  @HostListener('change', ['$event'])
  onChange(event: any) {
    let id = event?.target?.id;
    if ( id && id === 'toggleTable' ) {
      let cardTable = document.getElementById('card-container-tables') as HTMLElement;
      let titleTable = document.getElementById('title-table') as HTMLElement;
      let theadTable = document.getElementById('thead-table') as HTMLElement;
      let bodyTable = document.getElementById('tbody-table') as HTMLElement;
      // toggle class bg-gradient-default
      cardTable.classList.toggle('bg-gradient-default');
      // Verify if class bg-gradient-default exist
      if ( cardTable.classList.contains('bg-gradient-default') ) {
        // add to titleTable class text-white
        titleTable?.classList.add('text-white');
        // set color class form-label to white
        let formLabel = document.getElementsByClassName('form-label') as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < formLabel.length; i++) {
          formLabel[i].style.color = '#FFF';
        }

        // find thead and set color to white
        let thead = document.getElementsByTagName('thead') as HTMLCollectionOf<HTMLElement>;
        // add to thead class text-white
        for (let i = 0; i < thead.length; i++) {
          thead[i]?.classList.remove('text-dark');
          thead[i]?.classList.add('text-white');
        }
        // find tbody and set color to white
        let tbody = document.getElementsByTagName('tbody') as HTMLCollectionOf<HTMLElement>;
        // add to tbody class text-white
        for (let i = 0; i < tbody.length; i++) {
          tbody[i]?.classList.remove('text-dark');
          tbody[i]?.classList.add('text-white');
        }

      } else {
        // remove to titleTable class text-white
        titleTable?.classList.remove('text-white');
        // add to titleTable class text-dark
        titleTable?.classList.add('text-dark');
        // set color class form-label to dark
        let formLabel = document.getElementsByClassName('form-label') as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < formLabel.length; i++) {
          formLabel[i].style.color = '#000';
        }

        // find thead and set color to black
        let thead = document.getElementsByTagName('thead') as HTMLCollectionOf<HTMLElement>;
        // remove to thead class text-white and add  style color to black
        for (let i = 0; i < thead.length; i++) {
          thead[i]?.classList.remove('text-white');
          thead[i]?.classList.add('text-dark');
        }
        // find tbody and set color to black
        let tbody = document.getElementsByTagName('tbody') as HTMLCollectionOf<HTMLElement>;
        // remove to tbody class text-white
        for (let i = 0; i < tbody.length; i++) {
          tbody[i]?.classList.remove('text-white');
          tbody[i]?.classList.add('text-dark');
        }
      }

      // Verify if class thead-dark exist
      if ( theadTable?.classList.contains('thead-dark') ) {
        // remove to theadTable class thead-dark
        theadTable.classList.remove('thead-dark');
        // add to theadTable class thead-light
        theadTable.classList.add('thead-light');
        // set color bodyTable to white
        bodyTable.style.color = '#000';

      } else {
        // remove to theadTable class thead-light
        theadTable?.classList.remove('thead-light');
        // add to theadTable class thead-dark
        theadTable?.classList.add('thead-dark');
        // SET color bodyTable to black
        // bodyTable.style.color = '#FFF';
        if ( bodyTable ) {
          bodyTable.style.color = '#FFF';
        }
      }

    }
  }

}
