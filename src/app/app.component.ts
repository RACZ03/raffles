import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  langs: string[] = [];
  title = 'raffles';

  constructor(
    private translate: TranslateService
  ) {
    translate.setDefaultLang('es');
    translate.use('es')
    translate.addLangs(['en', 'es']);
    this.langs = this.translate.getLangs();

  }

  changeLang(lang: string) {
    this.translate.use(lang);
  }
}
