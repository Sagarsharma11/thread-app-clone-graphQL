import { createHmac, randomBytes } from "node:crypto"
import { prismaClient } from "../lib/db"

export interface CreateUserPayload {
    firstName: string
    lastName?: string
    email: string
    password: string
}

export interface GetUserTokenPayload {
    email: string
    password: string
}

class UserService {
    public static createUser(payload: CreateUserPayload) {
        const { firstName, lastName, email, password } = payload;
        const salt = randomBytes(32).toString("hex");
        const hashedPassword = createHmac('sha256', salt).update(password).digest('hex')
        return prismaClient.user.create({
            data: {
                firstName,
                lastName,
                email,
                salt,
                password: hashedPassword
            }
        })
    }

    private static getUserEmail(email: string){
        return prismaClient.user.findUnique({where:{email}});
    }

    public static getUserToken(payload: GetUserTokenPayload){
        const {email, password} = payload;
        const user = UserService.getUserEmail(email);

    }

}

export default UserService;