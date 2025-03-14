import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRippleModule } from '@angular/material/core';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatToolbarModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatMenuModule,
  MatDividerModule,
  MatSelectModule,
  MatChipsModule,
  MatBadgeModule,
  MatTooltipModule,
  MatTabsModule,
  MatSidenavModule,
  MatListModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatSlideToggleModule,
  MatRippleModule
];

@NgModule({
  imports: [...materialModules],
  exports: [...materialModules]
})
export class MaterialModule {}