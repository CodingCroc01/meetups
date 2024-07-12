import { useContext, useEffect, useState } from "react";
import Card from "../ui/Card";
import classes from "./MeetupItem.module.css";
import FavoritesContext from "../../store/favorites-context";

function MeetupItem(props) {
  const favoritesCtx = useContext(FavoritesContext);
  const itemIsFavorite = favoritesCtx.itemIsFavorite(props.id);
  const useFavorites = favoritesCtx.favorites;

  function toggleFavoriteStatusHandler() {
    if (itemIsFavorite) {
      console.log(props.id);
      console.log(useFavorites);
      favoritesCtx.removeFavorite(props.id);
    } else {
      favoritesCtx.addFavorite({
        image: props.image,
        address: props.address,
        title: props.title,
        description: props.description,
      });
      console.log(props.id);
      console.log(useFavorites);
    }
  }

  const handleDelete = () => {
    if (itemIsFavorite) {
      favoritesCtx.removeFavorite(props.id);
      props.deleteMeetup(props.id);
    } else {
      props.deleteMeetup(props.id);
    }
  };

  return (
    <li className={classes.item}>
      <Card>
        <div className={classes.image}>
          <img src={props.image} alt={props.title} />
        </div>
        <div className={classes.content}>
          <h3>{props.title}</h3>
          <address>{props.address}</address>
          <p>{props.description}</p>
        </div>
        <div className={classes.actions}>
          <button onClick={toggleFavoriteStatusHandler}>
            {itemIsFavorite ? "Remove from Favorites" : "To Favorites"}
          </button>
        </div>
        <div className={classes.delete}>
          <button onClick={handleDelete}>Delete</button>
        </div>
      </Card>
    </li>
  );
}

export default MeetupItem;
