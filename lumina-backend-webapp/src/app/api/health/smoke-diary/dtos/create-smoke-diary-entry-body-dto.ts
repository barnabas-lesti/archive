import {
  IsAlphanumeric,
  Length,
  IsDateString,
} from 'class-validator';

export class CreateSmokeDiaryEntryBodyDto {
  @IsAlphanumeric()
  @Length(16)
  userId: string;

  @IsDateString()
  utcDateTime: string;
}
