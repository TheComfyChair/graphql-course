const { ApolloServer, gql } = require("apollo-server");
const {
  filter,
  find,
  map,
  flowRight,
  flatten,
  get,
  includes
} = require("lodash/fp");
const uuid = require("uuid/v4");
const data = require("./data");

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.

const toppings = {
  pepperoni: {
    name: "Pepperoni",
    veggie: false,
    rating: "good"
  },
  pineapple: {
    name: "Pineapple",
    veggie: true,
    rating: "nope"
  },
  mushroom: {
    name: "Mushroom",
    veggie: true,
    rating: "meh"
  }
};

const typeDefs = gql`
  enum PizzaSizes {
    small
    medium
    large
  }

  type Pizza {
    uuid: String!
    size: PizzaSizes!
    toppings: [Topping!]!
  }

  input PizzaQueryInput {
    uuid: ID
  }

  input PizzaCreationInput {
    size: PizzaSizes!
    toppings: [ToppingAdditionInput!]!
  }

  extend type Query {
    pizza(input: PizzaQueryInput): Pizza
    allPizzas: [Pizza]
  }
`;

const resolvers = {
  Query: {
    pizza: (_, { input: pizzaInput }) =>
      find(({ uuid }) => uuid === pizzaInput)(data.getPizzas()),
    allPizzas: () => data.getPizzas()
  },
  /* Create a mutation which allows us to create a pizza. As part of creating the pizza, we should
     also create toppings as necessary. See the create order mutation for an example of how we
     can create toppings in such a way! Ensure that we return the new pizza in a way which satisfies
     the Pizza type */
  Mutation: {},
  Pizza: {
    size: root => "large",
    toppings: ({ toppings }) => {
      return filter(topping => includes(topping.uuid)(toppings))(
        data.getToppings()
      );
    }
  }
};

module.exports = {
  typeDefs,
  resolvers
};
