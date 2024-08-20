import { ApolloServer } from "@apollo/server";
import { prismaClient } from "../lib/db";
import { schema } from "../schema";
import { User } from "./user";

async function createApolloGraphqlServer() {
    // create graphql server
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
            }
            type Mutation {
                ${User.mutations}
            }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries
            },
            Mutation: {
                ...User.resolvers.mutations
                // createUser: async (_, { firstName, lastName, email, password }: {
                //     firstName: string, lastName: string, email: string, password: string
                // }) => {
                //     await prismaClient.user.create({
                //         data: {
                //             firstName,
                //             email,
                //             lastName,
                //             password,
                //             salt: "random_salt"
                //         }
                //     })
                //     return true;
                // }
            }
        },
    })
    await gqlServer.start()
    return gqlServer
}
export { createApolloGraphqlServer }