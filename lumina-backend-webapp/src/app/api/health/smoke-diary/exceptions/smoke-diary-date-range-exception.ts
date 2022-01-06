import { InvalidRequestException } from '../../../common/validation';

export class SmokeDiaryDateRangeException extends InvalidRequestException {
  constructor(endUtcDateTime: string) {
    super([
      {
        type: 'dateRange',
        message: 'endUtcDateTime must be later than startUtcDateTime',
        path: 'endUtcDateTime',
        invalidValue: endUtcDateTime,
      },
    ]);
  }
}
