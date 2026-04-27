import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'signalStrength', standalone: true })
export class SignalStrengthPipe implements PipeTransform {
  transform(rssi: number): string {
    if (rssi >= -50) return 'signal-excellent';
    if (rssi >= -65) return 'signal-good';
    if (rssi >= -80) return 'signal-fair';
    return 'signal-weak';
  }
}
