import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { BleService, BleConnectionState } from '../../../core/services/ble.service';

@Component({
  selector: 'app-connection-status',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './connection-status.component.html',
  styleUrl: './connection-status.component.scss',
})
export class ConnectionStatusComponent implements OnDestroy {
  state: BleConnectionState = 'disconnected';
  private sub: Subscription;

  constructor(private ble: BleService) {
    this.sub = this.ble.connectionState$.subscribe(s => this.state = s);
  }

  ngOnDestroy() { this.sub.unsubscribe(); }
}
