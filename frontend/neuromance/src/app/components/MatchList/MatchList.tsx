import styles from "./MatchList.module.css";
import MatchListItem from "../MatchListItem/MatchListItem";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  password: string;
}

interface MatchWithUserInfo {
  userInfo: UserInfo;
  PLI: number;
}

export default function MatchList() {
  const [matches, setMatches] = useState<MatchWithUserInfo[]>([]); // Initialize as an empty array
  const location = useLocation();
  const outputData = location.state?.outputData;

  console.log("Received Output Data:", outputData);

  // Function to fetch match data from API
  const postMatchData = async () => {
    try {
      // Make the POST request with `outputData` as the payload
      const response = await axios.post(
        `http://localhost:8000/api/algorithm`,
        outputData,
        {
          headers: {
            "Content-Type": "application/json", // Ensure the payload is sent as JSON
          },
        }
      );

      console.log("Match Data Response:", response.data);
      return response.data; // Should return matches with userID and PLI
    } catch (error) {
      console.error("Error posting match data:", error);
      return [];
    }
  };

  // Function to fetch user data from API
  const getUserInfo = async (userID: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/users/${userID}/`
      );
      console.log("User Info Response:", response.data);
      return response.data; // Backend returns { firstName, lastName, email, age, password }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  // Create a new list of matches with user info and PLI
  const getUserData = async () => {
    try {
      const matchData = await postMatchData(); // Fetch match data using POST
      console.log("Match Data:", matchData);
      console.log("Match Data:", matchData.comparisons);
      // loop through the match data to fetch user info for each match
      const updatedMatches: MatchWithUserInfo[] = [];

      // Loop through the match data to fetch user info for each match
      for (const match of matchData.comparisons) {
        console.log("Match:", match);
        const userInfo = await getUserInfo(match.individual_id);

        if (userInfo) {
          updatedMatches.push({
            userInfo: userInfo, // Attach user data
            PLI: match.PLI, // Attach PLI
          });
        }
      }

      // Update the matches state with the new data
      setMatches(updatedMatches);
    } catch (error) {
      console.error("Error fetching complete match data:", error);
    }
  };

  useEffect(() => {
    if (outputData) {
      getUserData(); // Fetch user data and update state
    }
  }, [outputData]);

  return (
    <div className={styles.matchList}>
      {matches.length > 0 ? (
        matches.map((match, index) => (
          <MatchListItem key={index} match={match} />
        ))
      ) : (
        <p>No matches available</p>
      )}
    </div>
  );
}
