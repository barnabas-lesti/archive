import { Subject } from 'rxjs';

import { EventSubject } from './event-subject';

export class EventService {
  eventSubject$: Subject<EventSubject> = new Subject();

  constructor() {
    this.eventSubject$ = new Subject();
  }

  on(event: string, handler: (data: any) => void): void {
    this.eventSubject$.subscribe({
      next: ({ eventName, data }) => {
        if (event === eventName) {
          handler(data);
        }
      }
    });
  }

  emit(event: string, data?: any): void {
    this.eventSubject$.next({ eventName: event, data });
  }
}
