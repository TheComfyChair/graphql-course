const { filter, find } = require("lodash/fp");
const uuid = require("uuid/v4");

const toppings = [
  {
    uuid: "12345",
    name: "Pepperoni",
    veggie: false,
    rating: "good"
  },
  {
    uuid: "12346",
    name: "Pineapple",
    veggie: true,
    rating: "nope"
  },
  {
    uuid: "12347",
    name: "Mushroom",
    veggie: true,
    rating: "meh"
  }
];

const pizzas = [
  {
    uuid: "1",
    size: "large",
    toppings: ["12345", "12346"]
  },
  {
    uuid: "2",
    size: "large",
    toppings: ["12345"]
  },
  {
    uuid: "3",
    size: "large",
    toppings: ["12346"]
  },
  {
    uuid: "4",
    size: "large",
    toppings: ["12345"]
  },
  {
    uuid: "5",
    size: "medium",
    toppings: ["12345"]
  }
];

const orders = [
  {
    name: "Destroyer of Pizzas",
    uuid: "123",
    pizzas: ["1", "2", "3"]
  },
  {
    name: "Grand archduchess of pizzas",
    uuid: "124",
    pizzas: ["4"]
  },
  {
    name: "Steve",
    uuid: "125",
    pizzas: ["5"]
  }
];

const pizzasReducer = (state = initialPizzas, { type, payload } = {}) => {
  switch (type) {
    case "ADD_PIZZA":
      return [...state, payload];
    case "REMOVE_PIZZA":
      return filter(pizza => pizza.uuid !== payload.uuid)(state);
  }
  return state;
};

const toppingsReducer = (state = initialToppings, { type, payload } = {}) => {
  switch (type) {
    case "ADD_TOPPING":
      return [...state, payload];
    case "REMOVE_TOPPING":
      return filter(pizza => pizza.uuid !== payload.uuid)(state);
  }
  return state;
};

const ordersReducer = (state = initialOrders, { type, payload } = {}) => {
  switch (type) {
    case "ADD_ORDER":
      return [...state, payload];
    case "REMOVE_ORDER":
      return filter(pizza => pizza.uuid !== payload.uuid)(state);
  }
  return state;
};

/* Data initialization */

const initializePizzaData = (initialPizzas = pizzas) => {
  let pizzaData = pizzasReducer(initialPizzas);

  const addPizza = pizza => {
    const newPizza = {
      ...pizza,
      uuid: uuid()
    };
    pizzaData = pizzasReducer(pizzaData, {
      type: "ADD_PIZZA",
      payload: newPizza
    });
    return newPizza;
  };

  const removePizza = pizza => {
    const pizzaToRemove = find(({ uuid }) => uuid === pizza.uuid)(orderData);
    pizzaData = pizzasReducer(pizzaData, {
      type: "REMOVE_PIZZA",
      payload: pizza
    });
    return pizzaToRemove;
  };

  const getPizzas = () => pizzaData;

  return {
    addPizza,
    removePizza,
    getPizzas
  };
};

const initializeOrderData = (initialOrders = orders) => {
  let orderData = ordersReducer(initialOrders);

  const addOrder = order => {
    const newOrder = {
      ...order,
      uuid: uuid()
    };
    orderData = ordersReducer(orderData, {
      type: "ADD_ORDER",
      payload: newOrder
    });
    return newOrder;
  };

  const removeOrder = order => {
    const orderToRemove = find(({ uuid }) => uuid === order.uuid)(orderData);
    orderData = ordersReducer(orderData, {
      type: "REMOVE_ORDER",
      payload: order
    });
    return orderToRemove;
  };

  const getOrders = () => orderData;

  return {
    addOrder,
    removeOrder,
    getOrders
  };
};

const initializeToppingData = (initialToppings = toppings) => {
  let toppingData = toppingsReducer(initialToppings);

  const addTopping = topping => {
    const newTopping = {
      ...topping,
      uuid: uuid()
    };
    toppingData = toppingsReducer(toppingData, {
      type: "ADD_TOPPING",
      payload: newTopping
    });
    return newTopping;
  };

  const removeTopping = topping => {
    const toppingToRemove = find(({ uuid }) => uuid === topping.uuid)(
      toppingData
    );
    toppingData = toppingsReducer(toppingData, {
      type: "REMOVE_TOPPING",
      payload: topping
    });
    return toppingToRemove;
  };

  const getToppings = () => toppingData;

  return {
    addTopping,
    removeTopping,
    getToppings
  };
};

module.exports = {
  ...initializePizzaData(),
  ...initializeOrderData(),
  ...initializeToppingData()
};
