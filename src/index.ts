import express, { query } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { schema } from "./schema.js";
import { prismaClient } from "./lib/db.js";


async function init() {
    const app = express();
    const PORT =  8000;

    app.use(express.json())

    // create graphql server
    const gqlServer = new ApolloServer({
        typeDefs:schema,
        resolvers: {
            Query: {
                hello: () => "Hello Graphql"
            },
            Mutation:{
                createUser: async(_,{firstName, lastName, email, password}:{
                    firstName:string,  lastName:string, email:string, password:string
                })=>{
                    await prismaClient.user.create({
                        data:{
                            firstName,
                            email,
                            lastName,
                            password,
                            salt:"random_salt"
                        }
                    })
                    return true;
                }
            }
        },
    })

    // start graphql server
    await gqlServer.start()
    
    app.get("/", (req, res) => {
        res.json({ message: "Server is up and running" })
    })
    app.use("/graphql", expressMiddleware(gqlServer))

    app.listen(PORT, () => {
        console.log(`Server started at PORT:${PORT}`)
    });
}

init()