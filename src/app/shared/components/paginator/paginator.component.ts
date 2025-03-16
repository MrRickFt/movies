import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-custom-paginator',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css'],
})
export class CustomPaginatorComponent implements OnChanges {
  @Input() length: number = 0;
  @Input() pageSize: number = 10;
  @Input() pageIndex: number = 0;
  @Output() pageChanged = new EventEmitter<PageEvent>();
  
  isFirstPage: boolean = true;
  isLastPage: boolean = false;
  totalPages: number = 0;
  
  ngOnChanges(changes: SimpleChanges): void {
    this.calculatePaginationState();
  }
  
  calculatePaginationState(): void {
    this.totalPages = Math.ceil(this.length / this.pageSize);
    this.isFirstPage = this.pageIndex === 0;
    this.isLastPage = this.pageIndex === this.totalPages - 1 || this.totalPages === 0;
  }
  
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.calculatePaginationState();
    this.pageChanged.emit(event);
  }
}