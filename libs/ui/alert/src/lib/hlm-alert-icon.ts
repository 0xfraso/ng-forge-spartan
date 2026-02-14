import { Directive } from '@angular/core';
import { provideHlmIconConfig } from '@hlm/icon';

@Directive({
	selector: '[hlmAlertIcon]',
	providers: [provideHlmIconConfig({ size: 'sm' })],
})
export class HlmAlertIcon {}
