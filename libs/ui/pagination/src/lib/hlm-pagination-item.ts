import { Directive } from '@angular/core';
import { classes } from '@hlm/utils';

@Directive({
	selector: 'li[hlmPaginationItem]',
	host: {
		'data-slot': 'pagination-item',
	},
})
export class HlmPaginationItem {
	constructor() {
		classes(() => '');
	}
}
