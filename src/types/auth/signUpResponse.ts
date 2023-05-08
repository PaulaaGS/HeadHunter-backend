import {User} from "../../auth/auth.entity";

export interface SignUpResponse {
    statusCode: number;
    message: string;
    user: User;
}