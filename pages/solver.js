import { Fragment, useState, useEffect, useCallback, useRef } from "react";
import LettersComponent from "../components/letters-component";
import useKeypress from "../curstom-hooks/useKeypress";

import styles from "../styles/Solver.module.scss";

const PLACE_HOLDER = ".....";

function Solver() {
  const [letter, setLetter] = useState("");
  const [position, setPosition] = useState("?");
  const [solved, setSolved] = useState(PLACE_HOLDER);
  const [lettersIn, setLettersIn] = useState("");
  const [lettersOut, setLettersOut] = useState("");
  const [regexNot, setRegexNot] = useState([]);
  const ref = useRef(null);
  useKeypress("Insert", () => (position !== "?" ? has(true) : null));
  useKeypress("Delete", () => (position !== "?" ? has(false) : null));
  useKeypress("Enter", () => (position === "?" ? hasnt() : null));
  useKeypress("1", () => setPosition("1"));
  useKeypress("2", () => setPosition("2"));
  useKeypress("3", () => setPosition("3"));
  useKeypress("4", () => setPosition("4"));
  useKeypress("5", () => setPosition("5"));
  useKeypress("Escape", () => {
    setPosition("?");
    setLetter("");
  });

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  const removeFromState = useCallback((letter, setter, keepSlot) => {
    setter((old) =>
      old.split("").reduce((acc, l) => {
        if (l !== letter) {
          acc += l;
        } else if (keepSlot) {
          acc += ".";
        }
        return acc;
      }, "")
    );
  }, []);

  const handleRemove = useCallback(
    (setter, keepSlot) => (letter) => {
      removeFromState(letter, setter, keepSlot);
      ref.current.focus();
    },
    [removeFromState]
  );

  const has = useCallback(
    (rightPosition) => {
      if (position !== "?" && letter) {
        if (rightPosition) {
          setSolved((old) => {
            const newSolved = old.split("");
            newSolved[position - 1] = letter;
            return newSolved.join("");
          });
          removeFromState(letter, setLettersIn);
          removeFromState(letter, setLettersOut);
        } else {
          if (
            solved.indexOf(letter) === -1 &&
            lettersIn.indexOf(letter) === -1
          ) {
            setLettersIn((old) => `${old}${letter}`);
          }
          const temp = PLACE_HOLDER.split("");
          temp[position - 1] = letter;
          const newRegexNot = temp.join("");
          if (!regexNot.includes(newRegexNot)) {
            setRegexNot((old) => [...old, newRegexNot]);
          }
          removeFromState(letter, setLettersOut);
        }
        setLetter("");
        setPosition("?");
      }
      ref.current.focus();
    },
    [position, letter, removeFromState, solved, lettersIn, regexNot]
  );

  const hasnt = useCallback(() => {
    if (position && letter) {
      if (lettersOut.indexOf(letter) === -1) {
        setLettersOut((old) => `${old}${letter}`);
      }
      removeFromState(letter, setSolved, true);
      removeFromState(letter, setLettersIn);
      setLetter("");
      setPosition("?");
    }
    ref.current.focus();
  }, [position, letter, lettersOut, removeFromState]);

  const removeFromRegexNot = useCallback((letterOrItem) => {
    const letter = /[a-z]/.test(letterOrItem);
    setRegexNot((old) => {
      if (letter) {
        return old.filter((item) => item !== letterOrItem);
      } else {
        return old.filter((item, i) => i !== letterOrItem);
      }
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.rules}></div>
      <h3>The word has those letters</h3>
      <span>Letter: </span>
      <input
        ref={ref}
        type="text"
        maxLength={1}
        className={styles.letterInput}
        value={letter}
        onChange={(e) => {
          if (/[a-zA-Z]{1}/.test(e.target.value)) {
            return setLetter(e.target.value.toLowerCase());
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
      {position === "?" ? (
        <>
          <button type="button" onClick={hasnt}>
            {"hasn't <Enter>"}
          </button>
        </>
      ) : (
        <>
          <button type="button" onClick={() => has(true)}>
            {"has right position <Insert>"}
          </button>
          <button type="button" onClick={() => has(false)}>
            {"has wrong position <Delete>"}
          </button>
        </>
      )}
      <p>
        SOLVED:{" "}
        <LettersComponent
          letters={solved}
          onClick={handleRemove(setSolved, true)}
          className={styles.correct}
        />
      </p>
      <p>
        Letters In:{" "}
        <LettersComponent
          letters={lettersIn}
          onClick={handleRemove(setLettersIn, false)}
          className={styles.existent}
        />
      </p>
      <p>
        Letters Out:{" "}
        <LettersComponent
          letters={lettersOut}
          onClick={handleRemove(setLettersOut, false)}
          className={styles.letter}
        />
      </p>
      <p>
        {"Patterns which doesn't match the word "}
        <ul>
          {regexNot.map((pattern, i) => (
            <li
              key={i}
              onClick={() =>
                setRegexNot((old) => old.filter((re) => re !== pattern))
              }
            >
              <LettersComponent
                letters={pattern}
                onClick={() => null}
                className={styles.notExistent}
              />
            </li>
          ))}
        </ul>
      </p>
    </div>
  );
}

export default Solver;
