import LetterComponent from "./letter-component";
import styles from "../styles/Solver.module.scss";

function LettersComponent({ letters, onClick, className }) {
  return letters
    .split("")
    .map((letter, i) => (
      <LetterComponent
        key={i}
        letter={letter}
        className={letter === "." ? styles.letter : className || styles.letter}
        onClick={() => onClick(letter)}
      />
    ));
}

export default LettersComponent;
