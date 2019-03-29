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

const typeDefs = gql`
  type Order {
    name: String!
    uuid: String!
    pizzas: [Pizza]!
  }

  input OrderCreationInput {
    name: String
    pizzas: [PizzaCreationInput]
  }

  input OrderQueryInput {
    uuid: ID
  }

  type Query {
    order(input: OrderQueryInput): Order
    allOrders: [Order]
  }

  type Mutation {
    removeOrder(input: OrderQueryInput): Order
    addOrder(input: OrderCreationInput): Order
  }
`;

const resolvers = {
  Query: {
    order: (_, args) =>
      find(({ uuid }) => uuid === get(["input", "uuid"])(args))(
        data.getOrders()
      ),
    allOrders: () => data.getOrders()
  },
  Mutation: {
    removeOrder: (_, { input: { uuid: orderUuid } }) => {
      return data.removeOrder({ uuid: orderUuid });
    },
    addOrder: (_, { input: { name, pizzas = [] } }) => {
      const pizzaUuids = flowRight(
        map(get("uuid")),
        map(data.addPizza),
        /* Create any new toppings */
        map(pizza => ({
          ...pizza,
          toppings: flowRight(
            map(get("uuid")),
            map(topping => (topping.uuid ? topping : data.addTopping(topping)))
          )(pizza.toppings)
        }))
      )(pizzas);

      const newOrder = data.addOrder({
        name,
        pizzas: pizzaUuids
      });

      return {
        ...newOrder,
        pizzas: filter(pizza => includes(pizza.uuid)(pizzaUuids))(
          data.getPizzas()
        )
      };
    }
  }
};

module.exports = {
  resolvers,
  typeDefs
};
