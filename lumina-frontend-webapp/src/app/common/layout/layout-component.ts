import { Component, Input, OnInit } from '@angular/core';
import { Router, Event, NavigationStart } from '@angular/router';

import { MenuItem } from 'primeng/api';

import { LayoutOptions } from './layout-options';

@Component({
  selector: 'app-layout',
  templateUrl: './layout-component.html',
  styleUrls: ['./layout-component.scss']
})
export class LayoutComponent implements OnInit {
  @Input() options: LayoutOptions;
  sidebarItems: MenuItem[] = [
    {
      label: 'Favorites',
      items: [
        { label: 'Dashboard', icon: 'fas fa-chart-line', routerLink: '/' },
      ]
    },
    {
      label: 'Health',
      items: [
        { label: 'Smoke Diary', icon: 'fas fa-smoking', routerLink: '/health/smoke-diary' },
      ],
    }
  ];

  isSidebarOpen: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.closeSidebar();
      }
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }
}
