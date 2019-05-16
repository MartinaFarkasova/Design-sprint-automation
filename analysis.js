
/**
 * Author: Martina Farkasova
 * Thesis: Process automation in Design sprint
 * Date: 15.05.2019
 **/

window.onload=function(){
  var button = document.getElementById("analyze");

  // After clicking on a button, Perform analysis and show results
  button.addEventListener("click", function() {

    // get the text for analysis
    var text = document.getElementById("input").value;
    // Show results with at least X occurrences
    var atLeast = document.getElementById("least").value;

    if (atLeast == 0) atLeast = 2;

    var numPhrases = 5; // Show statistics from 1 till ... word phrases
    var ignoreCase = true; // Case-sensitivity, if true, perform case-insensitive matching
    // Regex pattern to select valid characters. Valid are abc chars and apostrophes
    // Invalid characters are replaced with a whitespace
    var REinvalidChars = /[^a-zA-Z'\’\'\-]+/g;

    var i, j, k, textlen, len, s;
    // Prepare key hash for the 1 - 5 word phrases
    var keys = [null]; //"keys[0] = null", a word boundary with length zero is empty
    // array for results
    var results = [];

    //for human logic, we start counting at 1 instead of 0
    numPhrases++;
    // iterate over word phrases till reaching the set limit in numPhrases
    for (i = 1; i <= numPhrases; i++) {
      keys.push({});
    }

    // Excludes the following stop words ["a","an","the", "as", "is", "to", "on", "of", "oh", "it", "at", "i", "in", "so", "we", "you" ];
    var exclude = /(?:^|\W)a(?:$|\W)|(?:^|\W)an(?:$|\W)|(?:^|\W)the(?:$|\W)|(?:^|\W)as(?:$|\W)|(?:^|\W)is(?:$|\W)|(?:^|\W)to(?:$|\W)|(?:^|\W)on(?:$|\W)|(?:^|\W)of(?:$|\W)|(?:^|\W)oh(?:$|\W)|(?:^|\W)want(?:$|\W)|(?:^|\W)would(?:$|\W)|(?:^|\W)able(?:$|\W)|(?:^|\W)it(?:$|\W)|(?:^|\W)at(?:$|\W)|(?:^|\W)i(?:$|\W)|(?:^|\W)in(?:$|\W)|(?:^|\W)so(?:$|\W)|(?:^|\W)we(?:$|\W)|(?:^|\W)you(?:$|\W)/gm;
    // Let's exclude the hyphen as well "-"
    var hyphen = /(?:^|\W)-(?:$|\W)/gm;

    // Remove all irrelevant characters with a simple space
    // whitespace, escaped chars and stop words
    if (text != "") {
      text = text.replace(REinvalidChars, " ").replace(/^\s+/, "").replace(/\s+$/, "").replace(/(\r\n|\n|\r)/gm, " ").replace(exclude, " ").replace(hyphen, " ");
    }

    // Create a hash, case-insensitive
    if (ignoreCase) text = text.toLowerCase();
    // Split a string into an array of substrings
    text = text.split(/\s+/);

    // Using hash to analyze the word frequency was inspired by the     discussion on StackOverflow:
    // https://stackoverflow.com/questions/30906807/word-frequency-in-javascript/30907349#30907349
    // Author: https://stackoverflow.com/users/122868/cymen

    // length returns the number of elements in the array
    for (i = 0, textlen = text.length; i < textlen; i++) {
      // word from the text
      s = text[i];

      keys[1][s] = (keys[1][s] || 0) + 1;
      // numPhrases - from 1 till 5 word phrases
      for (j = 2; j <= numPhrases; j++) {
        // Combining the words from the text to create phrases
        // if it's bigger than the number of all the words in the text, break
        if (i + j <= textlen) {
          s += " " + text[i + j - 1];
          keys[j][s] = (keys[j][s] || 0) + 1;
        } else break;
      }
    }

    // Prepares the results for advanced analysis
    // numPhrases - from 1 till 5 word phrases
    for (var k = 1; k <= numPhrases; k++) {
      results[k] = [];
      //one word phrases -> two word phrases -> ...
      var key = keys[k];

      for (var i in key) {
        // if the word is there at least 2x
        if (key[i] >= atLeast) results[k].push({
          "word": i,
          "count": key[i]
        });
      }
    }

    // Parsing the results
    // Buffer data. This data is used to create a table using `.innerHTML`

    var outputHTML = [];

    // Sorting the results
    var f_sortAsc = function(x, y) {
      return y.count - x.count;
    };

    for (k = 1; k < numPhrases; k++) {
      //sorts results
      results[k].sort(f_sortAsc);

      var words = results[k];

      if (words.length) outputHTML.push('<td colSpan="3" class="num-words-header">' + k + ' word' + (k == 1 ? "" : "s") + '</td>');

      for (i = 0, len = words.length; i < len; i++) {

        //Characters have been validated. 
        // No fear of cross-site scripting
        outputHTML.push("<td>" + words[i].word + "</td><td>" +
          words[i].count + "</td><td>" +
          Math.round(words[i].count / textlen * 10000) / 100 + "%</td>");
        // textlen defined at the top
        // The relative occurence has a precision of 2 digits.
      }
    }

    if (outputHTML == 0) {
      outputHTML = 'No results to display. Check your input or change the restrictions.';
    } else {
      outputHTML = '<table id="wordAnalysis"><thead><tr>' +
        '<td>Phrase</td><td>Count</td><td>Relativity</td></tr>' +
        '</thead><tbody><tr>' + outputHTML.join("</tr><tr>") +
        "</tr></tbody></table>";
    }

    document.getElementById("results").innerHTML = outputHTML;

  }, false);
}
