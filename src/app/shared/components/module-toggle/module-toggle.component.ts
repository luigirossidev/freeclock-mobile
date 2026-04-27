import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonItem, IonToggle, IonIcon, IonNote } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-module-toggle',
  standalone: true,
  imports: [IonItem, IonToggle, IonIcon, IonNote, TranslateModule],
  templateUrl: './module-toggle.component.html',
  styleUrl: './module-toggle.component.scss',
})
export class ModuleToggleComponent {
  @Input() label = '';
  @Input() icon = '';
  @Input() enabled = false;
  @Input() autoScroll = false;
  @Input() showAutoScroll = true;
  @Input() disabled = false;
  @Input() hint = '';
  @Output() enabledChange = new EventEmitter<boolean>();
  @Output() autoScrollChange = new EventEmitter<boolean>();
}
