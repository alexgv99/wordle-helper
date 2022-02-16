function LetterComponent({ letter, className, onClick }) {
  return (
    <div className={className} onClick={onClick}>
      {letter}
    </div>
  );
}

export default LetterComponent;
