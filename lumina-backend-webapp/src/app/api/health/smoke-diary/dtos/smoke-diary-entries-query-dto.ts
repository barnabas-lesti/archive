import {
  IsAlphanumeric,
  Length,
  IsDateString,
} from 'class-validator';

export class SmokeDiaryEntriesQueryDto {
  @IsAlphanumeric()
  @Length(16)
  userId: string;

  @IsDateString()
  startUtcDateTime: string;

  @IsDateString()
  endUtcDateTime: string;
}
