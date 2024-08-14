import express, { query } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { schema } from "./schema.js";


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