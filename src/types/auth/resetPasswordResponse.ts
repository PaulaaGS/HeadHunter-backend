import {User} from "../../auth/auth.entity";

export interface ResetPasswordResponse {
    message: string;
    statusCode: number;
    user?: User;
}