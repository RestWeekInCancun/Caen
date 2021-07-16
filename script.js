async function getWordsList() {
  let wordsList = [];

  for (let i = 2; ; i++) {
    try {
      const path = `./words/${i}-letters.txt`;
      const data = await fetch(path);
      if (!data.ok) {throw "File doesn't exist!";}
      const words = await data.text();
      wordsList.push({length: i, words});
    } catch {
      break;
    }
  }

  return wordsList.reverse();
}

function findWords(words, letters) {
  const regex = new RegExp(`\\b([${letters}]{2,${letters.length}}\\*?)[^a-zA-Z]`, "g");
  const results = [...words.matchAll(regex)].reduce((acc, word) => {
    let wordTest = word[1];
    for (const letter of letters) {
      wordTest = wordTest.replace(letter, "");
    }
    if (wordTest === "" || wordTest === "*") {
      acc.push(word[1]);
    }
    return acc;
  }, []);

  return results;
}

document.addEventListener('DOMContentLoaded', () => {

  document.getElementById("searchWords").addEventListener("submit", async function (e) {
    e.preventDefault();

    // get input
    const input = document.getElementById("letters").value.toUpperCase().trim();

    // empty output
    const outputEl = document.getElementById("results");

    const wordsList = await getWordsList();

    let newHtml = "";

    for (let i = 0; i < wordsList.length; i++) {
      const wordSet = wordsList[i];
      const words = findWords(wordSet.words, input);
      if (words.length > 0) {
        newHtml += `<fieldset><legend>${wordSet.length} letters</legend>${words.map(word => {
          let css = "word ";

          if (word.indexOf("*") > -1) {
            css += "danger";
            word = word.substring(0, word.indexOf("*"));
          }

          return `<span class="${css}">${word}</span>`;
        }).join('')}</fieldset>`;
      }
    }

    if (newHtml === "") {
      newHtml = `No words found matching '${input}'`;
    }

    outputEl.innerHTML = newHtml;
  });
});