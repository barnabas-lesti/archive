import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-base-smoke-widget',
  templateUrl: './base-smoke-widget-component.html',
  styleUrls: ['./base-smoke-widget-component.scss']
})
export class BaseSmokeWidgetComponent implements OnInit {
  @Input() header: string;
  @Input() loading: boolean;
  @Input() noRefresh: boolean;
  @Output() onRefresh: EventEmitter<Event> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  emitRefresh(event: Event): void {
    this.onRefresh.emit(event);
  }
}
