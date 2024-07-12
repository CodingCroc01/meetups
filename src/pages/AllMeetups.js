import { useState, useEffect, useContext } from "react";
import MeetupList from "../components/meetups/MeetupList";
import FavoritesContext from "../store/favorites-context";

function AllMeetupsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [loadedMeetups, setLoadedMeetups] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    fetch(
      "https://react-refresher-meetup-project-default-rtdb.firebaseio.com/meetups.json"
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const meetups = [];

        for (const key in data) {
          const meetup = {
            id: key,
            ...data[key],
          };
          meetups.push(meetup);
        }

        setIsLoading(false);
        setLoadedMeetups(meetups);
      });
  }, []);

  const handleDeleteMeetup = (id) => {
    setLoadedMeetups((prevMeetups) =>
      prevMeetups.filter((meetup) => meetup.id !== id)
    );
    setDeleted(true);
  };

  useEffect(() => {
    if (!deleted) {
      return;
    } else {
      const meetupsObject = {};
      loadedMeetups.forEach((meetup) => (meetupsObject[meetup.id] = meetup));
      fetch(
        "https://react-refresher-meetup-project-default-rtdb.firebaseio.com/meetups.json",
        {
          method: "PUT",
          body: JSON.stringify(meetupsObject),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          if (response.ok) {
            console.log("Updated meetups successfully");
          } else {
            console.error("Failed to update database");
          }
        })
        .catch((error) => {
          console.error("Network error:", error);
        });
      setDeleted(false);
    }
  }, [deleted, loadedMeetups]);

  if (isLoading) {
    return (
      <section>
        <p>Loading...</p>
      </section>
    );
  }

  if (loadedMeetups.length === 0) {
    return (
      <section>
        <h3>No Meetups Found. Add some!</h3>
      </section>
    );
  }

  return (
    <section>
      <h1>All Meetups</h1>
      <MeetupList meetups={loadedMeetups} onDelete={handleDeleteMeetup} />
    </section>
  );
}

export default AllMeetupsPage;
