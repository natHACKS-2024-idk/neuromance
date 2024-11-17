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

  // matches test data
  const matchesTestData = [
    { userID: "ee1d46a9-1a4f-44cc-a1c7-29aec383b3dc", PLI: 0.9 }, // dan
    { userID: "ddc07140-2951-4087-83d5-644cffbc0039", PLI: 0.8 }, // bob
    { userID: "8bb70c87-cbe1-4382-8a02-33a7cbddd32e", PLI: 0.7 }, // sam
  ];

  // Function to fetch user data from API
  const getUserInfo = async (userID: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/users/${userID}/`
      );
      console.log(response.data);
      return response.data; // backend returns { firstName, lastName, email, age, password }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  // Create a new list of matches with user info and PLI
  const getUserData = async () => {
    const updatedMatches: MatchWithUserInfo[] = [];

    // Loop through matchesTestData to fetch user info for each match
    for (const match of matchesTestData) {
      const userInfo = await getUserInfo(match.userID);

      if (userInfo) {
        updatedMatches.push({
          userInfo: userInfo, // Attach user data
          PLI: match.PLI, // Attach PLI
        });
      }
    }

    // Update the matches state with the new data
    setMatches(updatedMatches);
  };

  useEffect(() => {
    getUserData(); // Fetch user data and update state
  }, []);

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
