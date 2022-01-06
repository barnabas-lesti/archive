import { environment } from '../../../environments/environment';

export class ConfigService {
  get(key: string): boolean | number | string {
    return environment[key];
  }
}
