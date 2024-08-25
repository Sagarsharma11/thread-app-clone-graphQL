import { createHmac, randomBytes } from "node:crypto";
import { prismaClient } from "../lib/db";
import JWT from "jsonwebtoken";

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

    private static generateHash(salt:string, password:string){

        return createHmac('sha256', salt).update(password).digest('hex');

    }

    public static createUser(payload: CreateUserPayload) {
        const { firstName, lastName, email, password } = payload;
        const salt = randomBytes(32).toString("hex");
        const hashedPassword = UserService.generateHash(salt, password)
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

    public static async getUserToken(payload: GetUserTokenPayload){
        const {email, password} = payload;
        const user = await UserService.getUserEmail(email);
        if(!user) throw new Error('user not found');

        const userSalt = user.salt;
        const usersHashPassword = UserService.generateHash(userSalt, password);

        if(usersHashPassword !== user.password) throw new Error("Incorrect Password");
        // Gen Token
        const secret_key = "helloworld";
        const token = JWT.sign({id: user.id, email:user.email}, secret_key);
        return token;
    }

}

export default UserService;