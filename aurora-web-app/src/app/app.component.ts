import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') public sidenav: MatSidenav;

  public menuItems: any[] = [
    { routerLink: '/', label: 'Home', icon: 'home', exact: true },
    { routerLink: '/about', label: 'About', icon: 'info' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && this.sidenav.opened) {
        this.sidenav.close();
      }
    });
  }
}
