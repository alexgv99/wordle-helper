function getWords(words, regex, notRegex, lettersIn, lettersOut) {
  let wordsOutput = [];
  words
    .filter((word) => regex.test(word))
    .filter((word) => !notRegex.some((re) => re.test(word)))
    .filter((word) => {
      return lettersIn.reduce((acc, ltr) => {
        const [letter, min] = ltr.split("");
        const re = new RegExp(letter, "g");
        const qtd = (word.match(re) || []).length;
        return acc && qtd >= min;
      }, true);
    })
    .filter((word) =>
      lettersOut.reduce(
        (acc, letter) =>
          acc && word.toLowerCase().indexOf(letter.toLowerCase()) === -1,
        true
      )
    )
    .forEach((word) => {
      wordsOutput.push(word);
    });
  return wordsOutput;
}

function analyzeDic(dic) {
  const letters = {};
  const regex = /...../i;
  dic
    .filter((word) => regex.test(word))
    .forEach((word) => {
      word.split("").forEach((letter) => {
        if (letters[letter]) {
          letters[letter]++;
        } else {
          letters[letter] = 1;
        }
      });
    });
  return letters;
}

function analyzeWords(dic) {
  const letters = analyzeDic(dic);
  const ranking = {};
  dic.forEach((word) => {
    let score = 0;
    let lastLetter = "";
    word
      .split("")
      .sort()
      .forEach((letter) => {
        if (lastLetter !== letter) {
          score += letters[letter] || 0;
        }
        lastLetter = letter;
      });
    ranking[word] = { word, score };
  });

  const words = Object.keys(ranking).sort(
    (w1, w2) => ranking[w2].score - ranking[w1].score
  );

  const output = words.reduce((acc, word) => [...acc, ranking[word]], []);

  return output.filter((word) => word.score > 0);
}

export { getWords, analyzeWords };
