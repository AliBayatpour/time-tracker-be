import { IUser } from "./user.interface";

export interface IItem {
  id: string;
  userId: IUser["id"];
  createdAt?: string;
  updatedAt?: string;
  category: string;
  description: string;
  finishedAt: number;
  sort: string;
  done: boolean;
  goal: number;
  progress: number;
}
