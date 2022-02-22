/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";

import useKeypress from "../curstom-hooks/useKeypress";

import LettersComponent from "../components/letters-component";

import dicEn from "../public/dic-en.json";
import dicPt from "../public/dic-pt.json";
import styles from "../styles/Solver.module.scss";
import { analyzeWords, getWords } from "../utils/tools";

const PLACE_HOLDER = ".....";

function Solver() {
  /* HOOKS */
  const router = useRouter();
  const ref = useRef(null);

  /* CUSTOM HOOKS */
  useKeypress("Insert", () => (position !== "?" ? has(true) : null));
  useKeypress("Delete", () => (position !== "?" ? has(false) : null));
  useKeypress("Enter", () => (position === "?" ? hasnt() : null));
  useKeypress("1", () => setPosition("1"));
  useKeypress("2", () => setPosition("2"));
  useKeypress("3", () => setPosition("3"));
  useKeypress("4", () => setPosition("4"));
  useKeypress("5", () => setPosition("5"));
  useKeypress("6", () => setPosition("?"));
  useKeypress("7", () => setPosition("?"));
  useKeypress("8", () => setPosition("?"));
  useKeypress("9", () => setPosition("?"));
  useKeypress("0", () => setPosition("?"));
  useKeypress("?", () => setPosition("?"));
  useKeypress("Escape", () => {
    setPosition("?");
    setLetter("");
  });

  /* STATE */
  const [letter, setLetter] = useState("");
  const [position, setPosition] = useState("?");
  const [solved, setSolved] = useState(PLACE_HOLDER);
  const [lettersIn, setLettersIn] = useState("");
  const [lettersOut, setLettersOut] = useState("");
  const [regexNot, setRegexNot] = useState([]);
  const [dic] = useState((old) => {
    console.log("router?.query: ", router?.query);
    return router?.query?.dic === "en" ? dicEn : dicPt;
  });
  const [words, setWords] = useState([]);
  const [initial, setInitial] = useState(false);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  useEffect(() => {
    if (
      lettersIn.length === 0 &&
      lettersOut.length === 0 &&
      solved === PLACE_HOLDER
    ) {
      if (!initial) {
        setInitial(true);
      }
    } else {
      if (initial) {
        setInitial(false);
      }
    }
  }, [initial, lettersIn, lettersOut, solved]);

  useEffect(() => {
    const regex = new RegExp(solved, "i");
    const notRegex = regexNot.map((re) => new RegExp(re, "i"));
    const inAux = lettersIn.split("").map((l) => `${l}1`);
    const outAux = lettersOut.split("");

    if (initial) {
      const ranking = analyzeWords(dic);
      setWords(ranking.slice(0, 10).map((word) => word.word));
    } else {
      setWords(getWords(dic, regex, notRegex, inAux, outAux));
    }
  }, [dic, lettersIn, lettersOut, regexNot, solved, initial]);

  useEffect(() => {
    const newIn = regexNot
      .map((p) => p.replace(/\./g, ""))
      .reduce((acc, l) => (acc.indexOf(l) === -1 ? `${acc}${l}` : acc), "");
    console.log("newIn: ", newIn);
    setLettersIn(newIn);
  }, [regexNot]);

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

  useEffect(() => console.log("lettersIn: ", lettersIn), [lettersIn]);

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
          // if (
          //   solved.indexOf(letter) === -1 &&
          //   lettersIn.indexOf(letter) === -1
          // ) {
          //   setLettersIn((old) => `${old}${letter}`);
          // }
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
      removeFromRegexNot(letter);
      setLetter("");
      setPosition("?");
    }
    ref.current.focus();
  }, [position, letter, lettersOut, removeFromState]);

  const removeFromRegexNot = useCallback(
    (letter) =>
      setRegexNot((old) => old.filter((p) => p.indexOf(letter) === -1)),
    [regexNot]
  );

  return (
    <div className={styles.container}>
      <div className={styles.input}>
        <h3 className={styles.innerTitle}>The word has those letters</h3>
        <div className="letter">
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
        </div>
        <div className="position">
          <span style={{ marginLeft: "15px" }}>Position: </span>
          {"12345?".split("").map((pos, i) => (
            <Fragment key={i}>
              <input
                style={{ marginLeft: "15px" }}
                id={`pos${i}`}
                type="radio"
                name="pos"
                value={pos}
                checked={pos === position}
                onChange={(e) => setPosition(e.target.value)}
              />
              <label htmlFor={`pos${i}`} style={{ marginRight: "5px" }}>
                {pos}
              </label>
            </Fragment>
          ))}
        </div>
        <div className="filler"></div>
        <div className={styles.toolbar}>
          {position === "?" ? (
            <>
              <button type="button" className={styles.hasnt} onClick={hasnt}>
                {"hasn't <Enter>"}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={styles.wrightSpot}
                onClick={() => has(true)}
              >
                {"wright spot <Insert>"}
              </button>
              <button
                type="button"
                className={styles.wrongSpot}
                onClick={() => has(false)}
              >
                {"wrong spot <Delete>"}
              </button>
            </>
          )}
        </div>
        <div>SOLVED:</div>
        <div>
          <LettersComponent
            letters={solved}
            onClick={handleRemove(setSolved, true)}
            className={styles.correct}
          />
        </div>
        <div>Letters In:</div>
        <div>
          <LettersComponent
            letters={lettersIn}
            onClick={removeFromRegexNot}
            className={styles.existent}
          />
        </div>
        <div>Letters Out:</div>
        <div>
          <LettersComponent
            letters={lettersOut}
            onClick={handleRemove(setLettersOut, false)}
            className={styles.notExistent}
          />
        </div>
      </div>
      <div className={styles.patterns}>
        <div>{"Patterns which doesn't match the word "}</div>
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
                className={styles.existent}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.words}>
        <div>
          {initial
            ? "Best words to start with:"
            : `Possible words (${words.length})`}
        </div>
        <ul className={styles.wordList}>
          {words.map((word) => (
            <li key={word}>{word}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Solver;
