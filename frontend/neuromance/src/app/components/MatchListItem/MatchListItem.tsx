import { useState } from "react";
import styles from "./MatchListItem.module.css";

export default function MatchListItem() {

    const [matchName, setMatchName] = useState(null);
    const [matchAge, setMatchAge] = useState(null);
    const [matchEmail, setMatchEmail] = useState(null);
    return (



    <div className={styles.container}>
    <div className={styles.cardLeft}>
        
            <img src="https://ui-avatars.com/api/?name=bob" alt="Card Image"  />
    
    </div>


    <div className={styles.cardRight}>
        <ul className={styles.ulList}>
            <li><label>Name: </label> {matchName}</li>
            <li><label>Age: </label> {matchAge}</li>
            <li><label>Email Id: </label> {matchEmail}</li>
        </ul>
    </div>
    </div>

);
}