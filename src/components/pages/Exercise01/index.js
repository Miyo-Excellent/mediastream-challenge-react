/**
 * Exercise 01: The Retro Movie Store
 * Implement a shopping cart with the next features for the Movie Store that is selling retro dvds:
 * 1. Add a movie to the cart
 * 2. Increment or decrement the quantity of movie copies. If quantity is equal to 0, the movie must be removed from the cart
 * 3. Calculate and show the total cost of your cart. Ex: Total: $150
 * 4. Apply discount rules. You have an array of offers with discounts depending of the combination of movie you have in your cart.
 * You have to apply all discounts in the rules array (discountRules).
 * Ex: If m: [1, 2, 3], it means the discount will be applied to the total when the cart has all that products in only.
 *
 * You can modify all the code, this component isn't well designed intentionally. You can redesign it as you need.
 */

import { useState } from "react";
import { nanoid } from "nanoid";
import { isEmpty } from "lodash";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";

import "./assets/styles.css";

export function Card(props) {
  const { id, name, price, quantity, key, onPressDecrement, onPressIncrement } =
    props;

  return (
    <li className="movies__cart-card" key={key}>
      <ul>
        <li>ID: {id}</li>
        <li>Name: {name}</li>
        <li>Price: ${price.toFixed(2)}</li>
      </ul>
      <div className="movies__cart-card-quantity">
        <button onClick={(event) => onPressDecrement(props, event)}>
          {quantity === 0 ? <FaTrash /> : <FaMinus />}
        </button>

        <span> {quantity} </span>

        <button onClick={(event) => onPressIncrement(props, event)}>
          <FaPlus />
        </button>
      </div>
    </li>
  );
}

export function Movie(props) {
  const { id, name, price, onPressAddToCart, key } = props;

  return (
    <li className="movies__list-card" key={key}>
      <ul>
        <li>ID: {id}</li>
        <li>Name: {name}</li>
        <li>Price: ${price.toFixed(2)}</li>
      </ul>
      <button onClick={(event) => onPressAddToCart(props, event)}>
        Add to cart
      </button>
    </li>
  );
}

export default function Exercise01() {
  const movies = [
    {
      id: 1,
      name: "Star Wars",
      price: 20,
    },
    {
      id: 2,
      name: "Minions",
      price: 25,
    },
    {
      id: 3,
      name: "Fast and Furious",
      price: 10,
    },
    {
      id: 4,
      name: "The Lord of the Rings",
      price: 5,
    },
  ];

  const discountRules = [
    {
      m: [3, 2],
      discount: 0.25,
    },
    {
      m: [2, 4, 1],
      discount: 0.5,
    },
    {
      m: [4, 2],
      discount: 0.1,
    },
  ];

  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Star Wars",
      price: 20,
      quantity: 2,
    },
  ]);

  const getMoviePriceWithDiscount = ({ price, quantity, id }) => {
    const movieDiscountsCollection = discountRules.filter(({ m }) => {
      const discountsAvailable = m.filter((discountId) => discountId === id);

      return !isEmpty(discountsAvailable);
    });

    const movieDiscount = movieDiscountsCollection.reduce(
      (totalDiscount, { discount }) => totalDiscount + discount,
      0
    );

    const priceWithDiscounts = price * (1 - movieDiscount);

    const total = priceWithDiscounts * quantity;

    return total;
  };

  // TODO: Implement this
  const getTotal = () =>
    cart.reduce((acc, movie) => {
      const total = getMoviePriceWithDiscount(movie);

      debugger;
      return acc + total;
    }, 0);

  const getMovie = (movie) => cart.find(({ id }) => id === movie.id);

  const validateMovie = (movie) => {
    if (isEmpty(movie)) {
      alert("This film does not exist in our library.");

      return false;
    }

    return true;
  };

  const onPressAddToCart = (movie, event) => {
    const movieValidation = validateMovie(movie);

    if (!movieValidation) return;

    const movieInCart = getMovie(movie);

    if (isEmpty(movieInCart)) setCart([...cart, { ...movie, quantity: 1 }]);
    else onPressIncrement(movie, event);
  };

  const onPressDecrement = (movie, event) => {
    if (movie.quantity === 0) {
      setCart(cart.filter(({ id }) => id !== movie.id));

      return;
    }

    setCart(
      cart.map((_movie) => {
        if (_movie.id === movie.id) {
          const quantity = _movie.quantity || 0;

          return { ..._movie, quantity: quantity - 1 > 0 ? quantity - 1 : 0 };
        }

        return _movie;
      })
    );
  };

  const onPressIncrement = (movie, event) => {
    console.log("Increment quantity", movie);

    setCart(
      cart.map((_movie) => {
        if (_movie.id === movie.id) {
          const quantity = _movie.quantity || 0;

          return { ..._movie, quantity: quantity + 1 };
        }

        return _movie;
      })
    );
  };

  const cartItemWithDiscounts = cart.map((movie) => ({
    ...movie,
    price: getMoviePriceWithDiscount(movie),
  }));

  return (
    <section className="exercise01">
      <div className="movies__list">
        <ul>
          {movies.map((movie) => (
            <Movie
              {...movie}
              onPressAddToCart={onPressAddToCart}
              key={nanoid()}
            />
          ))}
        </ul>
      </div>

      <div className="movies__cart">
        <ul>
          {cartItemWithDiscounts.map((movie) => (
            <Card
              {...movie}
              key={nanoid()}
              onPressDecrement={onPressDecrement}
              onPressIncrement={onPressIncrement}
            />
          ))}
        </ul>

        <div className="movies__cart-total">
          <p>Total: ${getTotal()}</p>
        </div>
      </div>
    </section>
  );
}
