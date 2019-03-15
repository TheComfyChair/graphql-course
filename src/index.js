const { ApolloServer, gql } = require("apollo-server");
const { filter, find, map, flowRight, flatten, get } = require("lodash/fp");
const uuid = require("uuid/v4");

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

let orders = [
  {
    name: "Destroyer of Pizzas",
    uuid: uuid(),
    pizzas: [
      {
        uuid: uuid(),
        size: "large",
        toppings: [toppings.pepperoni, toppings.mushroom]
      },
      {
        uuid: uuid(),
        size: "large",
        toppings: [toppings.pepperoni]
      },
      {
        uuid: uuid(),
        size: "large",
        toppings: [toppings.pineapple]
      },
      {
        uuid: uuid(),
        size: "large",
        toppings: [toppings.pepperoni]
      }
    ]
  },
  {
    name: "Grand archduchess of pizzas",
    uuid: uuid(),
    pizzas: [
      {
        uuid: uuid(),
        size: "medium",
        toppings: [toppings.pepperoni]
      }
    ]
  },
  {
    name: "Steve",
    uuid: uuid(),
    pizzas: [
      {
        uuid: uuid(),
        size: "small",
        toppings: [toppings.pepperoni]
      }
    ]
  }
];

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.

/* Exercise: 

   1) Create an enum called ToppingRating which has three options: nope, meh, and good

   2) Create a Topping type which has three fields: name (string), veggie (boolean), and rating (ToppingRating)

   3) Update the Pizza type so that it no longer has a veggie field, and instead has a toppings field which
      accepts an array of Topping types.
      
   4) With our updated types, create a query (in the playground @ http://localhost:4000/client) which selects the
      toppings for the pizzas in an order.

*/

const typeDefs = gql`
  enum PizzaSizes {
    small
    medium
    large
  }

  type Pizza {
    uuid: String!
    veggie: Boolean!
    size: PizzaSizes!
  }

  type Order {
    name: String!
    uuid: String!
    pizzas: [Pizza]!
  }

  input PizzaInput {
    uuid: ID
    veggie: Boolean!
    size: PizzaSizes!
  }

  input OrderInput {
    uuid: ID
    name: String
    pizzas: [PizzaInput]
  }

  type Query {
    order(input: OrderInput): Order
    pizza(input: PizzaInput): Pizza
    allOrders: [Order]
    allPizzas: [Pizza]
  }

  type Mutation {
    removeOrder(input: OrderInput): Order
    addOrder(input: OrderInput): Order
  }
`;

const resolvers = {
  Query: {
    order: (_, args) =>
      find(({ uuid }) => uuid === get(["input", "uuid"])(args))(orders),
    pizza: (_, args) =>
      flowRight(
        find(({ uuid }) => uuid === pizzaUuid),
        flatten,
        map(get("pizzas"))
      )(orders),
    allOrders: () => orders,
    allPizzas: () =>
      flowRight(
        flatten,
        map(get("pizzas"))
      )(orders)
  },
  Mutation: {
    removeOrder: (_, { input: { uuid: orderUuid } }) => {
      const orderToRemove = find(({ uuid }) => uuid === orderUuid)(orders);
      if (orderToRemove) {
        orders = filter(({ uuid }) => uuid !== orderUuid)(orders);
      }
      return orderToRemove;
    },
    addOrder: (_, { input: { name, pizzas = [] } }) => {
      const newOrder = {
        name,
        pizzas: map(pizza => ({
          ...pizza,
          veggie: Boolean(pizza.veggie),
          uuid: uuid()
        }))(pizzas),
        uuid: uuid()
      };
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
