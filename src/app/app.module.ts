// app.module.ts
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSortHeader } from '@angular/material/sort';
import { MaterialTableComponent } from './material-table/material-table.component';
import {HttpClientModule} from "@angular/common/http";
import { MatDialogModule } from '@angular/material/dialog';
import {EditDialogComponent} from "./edit-dialog/edit-dialog.component";
import { ReactiveFormsModule } from '@angular/forms';
import {CommonModule} from "@angular/common";
import { OverlayModule } from '@angular/cdk/overlay';
// import {OverlayConfigService} from "./overlay-config.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCheckboxModule} from "@angular/material/checkbox";

@NgModule({
  declarations: [
    MaterialTableComponent,
    EditDialogComponent
  ],
  providers: [],
  imports: [
    MatTableModule,
    MatSortModule,
    MatSortHeader,
    HttpClientModule,
    MatDialogModule,
    ReactiveFormsModule,
    CommonModule,
    OverlayModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule
  ],
  bootstrap: [MaterialTableComponent, EditDialogComponent],
  exports: [
    MaterialTableComponent,
    EditDialogComponent
  ]
})
export class AppModule { }
