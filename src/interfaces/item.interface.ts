import { IUser } from "./user.interface";

export interface IItem {
  id: string;
  user_id: IUser["id"];
  body: string;
}
