import { JwtActionEnum } from './jwt-action.enum';

export interface IJwtActionPayload {
  id: string;
  email: string;
  type: JwtActionEnum;
}
