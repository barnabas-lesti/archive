import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { ToolbarModule } from 'primeng/toolbar';
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';

import { LayoutComponent } from './layout-component';

@NgModule({
  declarations: [LayoutComponent],
  exports: [LayoutComponent],
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
    ButtonModule,
    AvatarModule,
    ToolbarModule,
    SidebarModule,
    MenuModule,
  ],
})
export class LayoutModule {}
