import { Component } from '@angular/core';

import { LayoutOptions } from './common/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app-component.html',
  styleUrls: ['./app-component.scss']
})
export class AppComponent {
  layoutOptions: LayoutOptions = {
    brandImageUrl: 'https://www.primefaces.org/poseidon-ng/assets/layout/images/logo-poseidon.png',
    avatarImageUrl: 'https://avatars.githubusercontent.com/u/11849644?s=460&u=b2d225761ed41f52eb8012c09b31ac8e971a6294&v=4',
  };

  constructor() {}
}
