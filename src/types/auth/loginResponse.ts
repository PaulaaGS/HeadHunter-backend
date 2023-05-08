import {User} from "../../auth/auth.entity";

export interface LoginResponse {
    message: string;
    statusCode: number;
    user?: User;
}