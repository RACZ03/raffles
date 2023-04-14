import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LimitsSuperAdminRoutingModule } from './limits-super-admin-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { TagInputModule } from 'ngx-chips';
import { NgxTagsInputBoxModule } from 'ngx-tags-input-box';
import { NgSelectModule } from '@ng-select/ng-select';
import { CambiarLimitnumxVendedorComponent } from './cambiar-limitnumx-vendedor/cambiar-limitnumx-vendedor.component';
import { CambiarLimitunLimiteComponent } from './cambiar-limitun-limite/cambiar-limitun-limite.component';
import { CambiarLimitsinafectarlimitadosComponent } from './cambiar-limitsinafectarlimitados/cambiar-limitsinafectarlimitados.component';
import { CambiarLimitnumunVendedorComponent } from './cambiar-limitnumun-vendedor/cambiar-limitnumun-vendedor.component';
import { LiberarnumVendedorComponent } from './liberarnum-vendedor/liberarnum-vendedor.component';
import { LiberarnumRutasComponent } from './liberarnum-rutas/liberarnum-rutas.component';
import { LiberarnumNegocioComponent } from './liberarnum-negocio/liberarnum-negocio.component';
import { CambiarLimitnumxRutaComponent } from './cambiar-limitnumx-ruta/cambiar-limitnumx-ruta.component';
import { LimitsSuperAdminComponent } from './limits-super-admin.component';


@NgModule({
  declarations: [
    CambiarLimitnumxVendedorComponent,
    CambiarLimitunLimiteComponent,
    CambiarLimitsinafectarlimitadosComponent,
    CambiarLimitnumunVendedorComponent,
    LiberarnumVendedorComponent,
    LiberarnumRutasComponent,
    LiberarnumNegocioComponent,
    CambiarLimitnumxRutaComponent,
    LimitsSuperAdminComponent
  ],
  imports: [
    CommonModule,
    LimitsSuperAdminRoutingModule,
    TranslateModule,
    ThemeModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgxMaskModule,
    TagInputModule,
    NgxTagsInputBoxModule,
    FormsModule,
    NgSelectModule
  ]
})
export class LimitsSuperAdminModule { }
