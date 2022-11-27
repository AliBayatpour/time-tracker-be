import { IUser } from "./user.interface";

export interface IItem {
  id: string;
  user_id: IUser["id"];
  category: string;
  description: string;
  finished_at: number;
  sort: string;
  done: boolean;
  goal: number;
  progress: number;
}
