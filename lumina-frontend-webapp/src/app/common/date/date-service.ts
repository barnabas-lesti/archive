import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { DateUnit } from './date-unit';

@Injectable()
export class DateService {
  constructor() {}

  now(): Date {
    return new Date();
  }

  toDate(dateString: string): Date {
    return new Date(dateString);
  }

  dayStart(date: Date): Date {
    return moment(date).startOf('day').toDate();
  }

  dayEnd(date: Date): Date {
    return moment(date).endOf('day').toDate();
  }

  addToDate(date: Date, amount: number, unit: DateUnit): Date {
    return moment(date).add(amount, unit).toDate();
  }

  subtractFromDate(date: Date, amount: number, unit: DateUnit): Date {
    return this.addToDate(date, amount * -1, unit);
  }

  createTimerStringFromMs(ms: number): string {
    const absoluteMs = Math.abs(ms);
    const seconds = Math.floor((absoluteMs / 1000) % 60);
    const minutes = Math.floor((absoluteMs / (1000 * 60)) % 60);
    const hours = Math.floor((absoluteMs / (1000 * 60 * 60)) % 24);

    const hoursString = (hours < 10) ? '0' + hours : hours;
    const minutesString = (minutes < 10) ? '0' + minutes : minutes;
    const secondsString = (seconds < 10) ? '0' + seconds : seconds;

    const timeString = `${hoursString}:${minutesString}:${secondsString}`;

    return ms >= 0 ? timeString : `-${timeString}`;
  }
}
