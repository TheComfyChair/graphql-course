const { ApolloServer, gql } = require("apollo-server");
const { filter, find } = require("lodash/fp");
const uuid = require("uuid/v4");

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.

let orders = [
  {
    name: "Destroyer of Pizzas",
    id: uuid(),
    pizzas: [
      {
        size: "large",
        veggie: false
      },
      {
        size: "large",
        veggie: false
      },
      {
        size: "large",
        veggie: false
      },
      {
        size: "large",
        veggie: true
      }
    ]
  },
  {
    name: "Grand archduchess of pizzas",
    id: uuid(),
    pizzas: [
      {
        size: "medium",
        veggie: false
      }
    ]
  },
  {
    name: "Steve",
    id: uuid(),
    pizzas: [
      {
        size: "small",
        veggie: true
      }
    ]
  }
];

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  enum PizzaSizes {
    small
    medium
    large
  }

  type Pizza {
    veggie: Boolean!
    size: PizzaSizes!
  }

  type Order {
    name: String!
    id: String!
    pizzas: [Pizza]!
  }

  input PizzaInput {
    veggie: Boolean!
    size: PizzaSizes!
  }

  input OrderInput {
    id: String
    name: String
    pizzas: [PizzaInput]
  }

  type Query {
    orders: [Order]
  }

  type Mutation {
    removeOrder(input: OrderInput): Order
    addOrder(input: OrderInput): Order
  }
`;

const resolvers = {
  Query: {
    orders: () => orders
  },
  Mutation: {
    removeOrder: (_, { input: { id: orderId } }) => {
      const orderToRemove = find(({ id }) => id === orderId)(orders);
      if (orderToRemove) {
        orders = filter(({ id }) => id !== orderId)(orders);
      }
      return orderToRemove;
    },
    addOrder: (_, { input: { name, pizzas = [] } }) => {
      const newOrder = { name, pizzas, id: uuid() };
      orders = [...orders, newOrder];
      return newOrder;
    }
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
