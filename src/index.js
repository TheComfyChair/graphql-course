const { ApolloServer, gql, makeExecutableSchema } = require("apollo-server");
const { filter, find, map, flowRight, flatten, get } = require("lodash/fp");
const { merge } = require("lodash");
const uuid = require("uuid/v4");
const orders = require("./orders");
const pizzas = require("./pizzas");
const toppings = require("./toppings");

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
  typeDefs: [orders.typeDefs, pizzas.typeDefs, toppings.typeDefs],
  resolvers: merge([orders.resolvers, pizzas.resolvers, toppings.resolvers])
});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
