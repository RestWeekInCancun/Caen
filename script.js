let words = fetch("./words.txt").then(resp => resp.text()).then(data => start(data));

function start(words) {
  function findWords(letters) {
    const regex = new RegExp(`\\b[${letters}]{2,${letters.length}}\\b`, "g");
    const results = [...words.matchAll(regex)].reduce((acc, word) => {
      let [wordTest] = word;
      for (const letter of letters) {
        wordTest = wordTest.replace(letter, "");
      }
      if (wordTest === "") {
        acc.push(word[0]);
      }
      return acc;
    }, []);

    return results;
  }

  document.getElementById("searchWords").addEventListener("submit", function (e) {
    e.preventDefault();
    const input = document.getElementById("letters").value.toUpperCase().trim();
    if (input) {
      const outputEl = document.getElementById("results");
      while (outputEl.firstChild) {
        outputEl.removeChild(outputEl.firstChild);
      }
      const result = findWords(input);
      const newHtml =
        result.length > 0
          ? result.map((word) => `<span class="word">${word}</span>`).join("")
          : `No words found matching '${input}'`;

      outputEl.innerHTML = newHtml;
    }
  });

  return words;
}