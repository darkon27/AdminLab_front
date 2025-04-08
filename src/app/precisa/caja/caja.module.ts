import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbInputModule, NbTooltipModule } from '@nebular/theme';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';
import {BlockUIModule} from 'primeng/blockui';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TreeModule } from 'primeng/tree';
import { ThemeModule } from '../../@theme/theme.module';
import { CajaRoutingModule, routedComponents } from './caja-routing.routes';
import {TabViewModule} from 'primeng/tabview';
import { CobranzasComponent } from './cobranzas/view/cobranzas.component';
import { ActionReducer, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { ComunModule } from '../framework-comun/Comun.module';

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({keys: ['perfil'], rehydrate: true})(reducer);
}
const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];


@NgModule({
  declarations: [
    ...routedComponents
  ],
  exports:[
  ],
  imports: [
    TabViewModule,
    DividerModule,
    InputNumberModule,
    CalendarModule,
    CommonModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    BlockUIModule,
    TableModule,
    HttpClientModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    NbTooltipModule,
    FieldsetModule,
    TreeModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    ToastModule,
    OverlayPanelModule,
    CajaRoutingModule,
    CardModule,
    ComunModule,
  ],

  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    MessageService, ConfirmationService]
})

export class CajaModule { }
