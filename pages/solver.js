import { Fragment, useState, useMemo, useCallback } from "react";

import styles from "../styles/Solver.module.css";

const PLACE_HOLDER = ".....";

function Solver() {
  const [letter, setLetter] = useState("");
  const [position, setPosition] = useState("?");
  const [solved, setSolved] = useState(PLACE_HOLDER);
  const [lettersIn, setLettersIn] = useState("");
  const [lettersOut, setLettersOut] = useState("");
  const [regexNot, setRegexNot] = useState([]);

  const has = useCallback(() => {
    if (position && letter) {
      if (position === "?") {
        if (solved.indexOf(letter) === -1 && lettersIn.indexOf(letter) === -1) {
          setLettersIn((old) => `${old}${letter}`);
        }
      } else {
        setSolved((old) => {
          const newSolved = old.split("");
          newSolved[position - 1] = letter;
          return newSolved.join("");
        });
      }
      setLetter("");
      setPosition("?");
    }
  }, [letter, position, solved, lettersIn]);

  const hasnt = useCallback(() => {
    if (position && letter) {
      if (position === "?") {
        if (
          solved.indexOf(letter) === -1 &&
          lettersOut.indexOf(letter) === -1
        ) {
          setLettersOut((old) => `${old}${letter}`);
        }
      } else {
        const temp = PLACE_HOLDER.split("");
        temp[position - 1] = letter;
        const newRegexNot = temp.join("");
        setRegexNot((old) => [...old, newRegexNot]);
      }
      setLetter("");
      setPosition("?");
    }
  }, [letter, position, solved, lettersOut]);

  return (
    <div className={styles.container}>
      <div className={styles.rules}></div>
      <h3>The word has those letters</h3>
      <span>Letter: </span>
      <input
        type="text"
        maxLength={1}
        style={{ width: "30px" }}
        value={letter}
        onChange={(e) => {
          if (/[a-z]{1}/.test(e.target.value)) {
            return setLetter(e.target.value);
          }
        }}
      />
      <span style={{ marginLeft: "15px" }}>Position: </span>
      {"12345?".split("").map((pos, i) => (
        <Fragment key={i}>
          <input
            style={{ marginLeft: "15px" }}
            type="radio"
            name="pos"
            value={pos}
            checked={pos === position}
            onChange={(e) => setPosition(e.target.value)}
          />
          <span style={{ marginRight: "5px" }}>{pos}</span>
        </Fragment>
      ))}
      <button type="button" onClick={has}>
        {"has"}
      </button>
      <button type="button" onClick={hasnt}>
        {"hasn't"}
      </button>
      <p>SOLVED: {solved}</p>
      <p>
        Letters In:{" "}
        {lettersIn.split("").map((l, i) => (
          <span key={i} style={{ marginLeft: "5px" }}>
            {l}
          </span>
        ))}
      </p>
      <p>
        Letters Out:{" "}
        {lettersOut.split("").map((l, i) => (
          <span key={i} style={{ marginLeft: "5px" }}>
            {l}
          </span>
        ))}
      </p>
      <p>
        {"Patterns which doesn't match the word "}
        <ul>
          {regexNot.map((pattern, i) => (
            <li key={i}>{pattern}</li>
          ))}
        </ul>
      </p>
    </div>
  );
}

export default Solver;
