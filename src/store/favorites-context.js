import { createContext, useState, useEffect } from "react";

const FavoritesContext = createContext({
  favorites: [],
  totalFavorites: 0,
  addFavorite: (favoriteMeetup) => {},
  removeFavorite: (meetupId) => {},
  itemIsFavorite: (meetupId) => {},
});

// Provider provides the context to the components and update state
export function FavoritesContextProvider(props) {
  const [userFavorties, setUserFavorites] = useState([]);
  useEffect(() => {
    fetch(
      "https://react-refresher-meetup-project-default-rtdb.firebaseio.com/favorites.json"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch favorites from Firebase");
        }
        return response.json();
      })
      .then((data) => {
        const favoritesArray = [];
        for (const key in data) {
          favoritesArray.push({
            id: key, // Use Firebase key as the id
            image: data[key].image,
            address: data[key].address,
            title: data[key].title,
            description: data[key].description,
          });
        }
        setUserFavorites(favoritesArray);
      })
      .catch((error) => {
        console.error("Error fetching favorites:", error);
      });
  }, []);

  function addFavoriteHandler(favoriteMeetup, meetupId) {
    fetch(
      "https://react-refresher-meetup-project-default-rtdb.firebaseio.com/favorites.json",
      {
        method: "POST",
        body: JSON.stringify({
          ...favoriteMeetup,
          id: meetupId, // Use the meetup ID obtained earlier
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add favorite to Firebase");
        }
        return response.json();
      })
      .then((data) => {
        const firebaseId = data.name; // Firebase-generated favorite ID
        setUserFavorites((prevUserFavorites) => [
          ...prevUserFavorites,
          { ...favoriteMeetup, id: firebaseId }, // Use Firebase-generated 'name' as id
        ]);
      })
      .catch((error) => {
        console.error("Error adding favorite:", error);
      });
  }

  // function addFavoriteHandler(favoriteMeetup) {
  //   fetch(
  //     "https://react-refresher-meetup-project-default-rtdb.firebaseio.com/favorites.json",
  //     {
  //       method: "POST",
  //       body: JSON.stringify(favoriteMeetup),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   )
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Failed to add favorite to Firebase");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       const firebaseId = data.name; // Firebase-generated ID
  //       setUserFavorites((prevUserFavorites) => [
  //         ...prevUserFavorites,
  //         { ...favoriteMeetup, id: firebaseId }, // Use Firebase-generated 'name' as id
  //       ]);
  //     })
  //     .catch((error) => {
  //       console.error("Error adding favorite:", error);
  //     });
  // }

  function removeFavoriteHandler(meetupId) {
    fetch(
      `https://react-refresher-meetup-project-default-rtdb.firebaseio.com/favorites/${meetupId}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete favorite from Firebase");
        }
        setUserFavorites((prevUserFavorites) =>
          prevUserFavorites.filter((meetup) => meetup.id !== meetupId)
        );
      })
      .catch((error) => {
        console.error("Error deleting favorite:", error);
      });
  }

  function itemIsFavoriteHandler(meetupId) {
    return userFavorties.some((meetup) => meetup.id === meetupId);
  }

  const context = {
    favorites: userFavorties,
    totalFavorites: userFavorties.length,
    addFavorite: addFavoriteHandler,
    removeFavorite: removeFavoriteHandler,
    itemIsFavorite: itemIsFavoriteHandler,
  };

  return (
    <FavoritesContext.Provider value={context}>
      {props.children}
    </FavoritesContext.Provider>
  );
}

export default FavoritesContext;
