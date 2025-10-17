import { User } from "./user";

export interface auth {
    success:boolean
    token:string;
    message:string;
    user:User

}

