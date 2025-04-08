import { NgModule } from '@angular/core';
import { NbActionsModule, NbCardModule, NbIconModule, NbInputModule, NbTooltipModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { AdmisionRoutingModule, routedComponents } from './admision-routing.routes';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { TreeModule } from 'primeng/tree';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { InputMaskModule } from 'primeng/inputmask';
import { ComunModule } from '../framework-comun/Comun.module';
import { ServicioComunService } from '../framework-comun/servicioComun.service';
import {BlockUIModule} from 'primeng/blockui';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
    '@angular/platform-browser/animations';
//import { NgxSoapModule, NgxSoapService } from 'ngx-soap';

@NgModule({
  imports: [
    BlockUIModule,
    DividerModule,
    InputNumberModule,
    CalendarModule,
    CommonModule,
    AdmisionRoutingModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,    
    NbTooltipModule,  
    NbActionsModule,
    ThemeModule,
    TableModule,
    HttpClientModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    FieldsetModule,
    TreeModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    ToastModule,
    OverlayPanelModule,
    InputMaskModule,
    ComunModule,
    PdfJsViewerModule
   // NgxSoapModule,

  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    MessageService, ConfirmationService
    , ServicioComunService
    // ,NgxSoapService
  ]
})
export class AdmisionModule { }
