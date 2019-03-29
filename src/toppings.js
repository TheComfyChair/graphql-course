const { ApolloServer, gql } = require("apollo-server");
const { filter, find, map, flowRight, flatten, get } = require("lodash/fp");
const uuid = require("uuid/v4");
const data = require("./data");

const typeDefs = gql`
  enum ToppingRating {
    nope
    meh
    good
  }

  type Topping {
    uuid: ID!
    name: String!
    veggie: Boolean!
    rating: ToppingRating
  }

  """
  This input is used when adding a topping to a pizza, where we can either
  add via uuid, or by specifying name/veggie/rating.
  """
  input ToppingAdditionInput {
    uuid: ID
    name: String
    veggie: Boolean
    rating: ToppingRating
  }

  input ToppingCreationInput {
    name: String!
    veggie: Boolean!
    rating: ToppingRating
  }
`;

const resolvers = {
  Query: {
    /* Create an all topping query (see the pizzas and orders files for examples!). This query 
       will also be needed to add to our graphQL type definitions */
    /* Create a query which allows us to search for a specific topping. Again, ensure we add the type
       definition! For now, like order and pizzas, we just need to be able to search using the uuid */
  },
  Mutation: {
    /* Create a mutation which allows us to create a new topping. Add the type definition for the mutation,
       and use the ToppingCreationInput as the input type. We should return the new topping in a way
       which matches the Topping type. */
  }
};

module.exports = {
  typeDefs,
  resolvers
};
