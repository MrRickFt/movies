import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MaterialModule } from '../../../shared/material.module';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent implements OnInit {
  private readonly loadingService = inject(LoadingService);
  
  loading$!: Observable<boolean>;
  
  ngOnInit() {
    this.loading$ = this.loadingService.loading$;
  }
}