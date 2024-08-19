export  const schema = `#graphql
type Query {
    hello: String
}
type Mutation {
    createUser(firstName:String!,lastName:String!,email:String!, password:String!):Boolean
}`;