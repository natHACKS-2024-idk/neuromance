import React, { useState, useEffect } from "react";
import styles from "./MatchListItem.module.css";

// Define the props interface for the MatchListItem component
interface MatchListItemProps {
  match: {
    userInfo: {
      firstName: string;
      lastName: string;
      email: string;
      age: number;
    };
    PLI: number;
  };
}

export default function MatchListItem({ match }: MatchListItemProps) {
  const [matchName, setMatchName] = useState<string | null>(null);
  const [matchAge, setMatchAge] = useState<number | null>(null);
  const [matchEmail, setMatchEmail] = useState<string | null>(null);

  // Use effect to set match data
  useEffect(() => {
    setMatchName(`${match.userInfo.firstName} ${match.userInfo.lastName}`);
    setMatchAge(match.userInfo.age);
    setMatchEmail(match.userInfo.email);
  }, [match]);

  return (
    <div className={styles.container}>
      <div className={styles.cardLeft}>
        <img
          src={`https://ui-avatars.com/api/?name=${match.userInfo.firstName}`}
          alt="Card Image"
        />
      </div>

      <div className={styles.cardRight}>
        <ul className={styles.ulList}>
          <li>
            <label>Name: </label> {matchName}
          </li>
          <li>
            <label>Age: </label> {matchAge}
          </li>
          <li>
            <label>Email Id: </label> {matchEmail}
          </li>
        </ul>
      </div>
    </div>
  );
}
