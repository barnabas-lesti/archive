import {
  IsAlphanumeric,
  Length,
} from 'class-validator';

export class LatestSmokeDiaryEntryQueryDto {
  @IsAlphanumeric()
  @Length(16)
  userId: string;
}
