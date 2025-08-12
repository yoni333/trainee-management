import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/modules/material.module';

@Component({
  selector: 'app-monitor',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent {}
