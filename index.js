var fs = require("fs");
const https = require('https');

// bring data
https.get('https://api.dictionaryapi.dev/api/v2/entries/en/averse', (resp) => {
  let data = '';

  // A chunk of data has been received.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
                var result = JSON.parse(data);
                // console.log(JSON.parse(data));
                // var result = data;
                var innerHTML = "<details><summary>";
                var synonyms = "synonyms: ";
                console.log("***************************")
                console.log(result[0].meanings);
                //innerHTML += result[0].word + "</summary>";

                //console.log(result[0].meanings);
                console.log(result[0].meanings.length);
                result[0].meanings.forEach(meaning => {
                    console.log( "" + meaning.partOfSpeech + ": ");
                    //innerHTML += "* " + meaning.partOfSpeech + "<br>";
                    meaning.definitions.forEach(definition => {
                        console.log("    * " + definition.definition);
                        //innerHTML += "    * " + definition.definition + "<br>";
                        console.log("    ex: " + definition.example);
                        //innerHTML += "    * ex: " + definition.example + "<br>";
                        synonyms += " " + definition.synonyms[0];
                        for (let i = 1; i < 5; i++) {
                            const synonym = definition.synonyms[i];
                            synonyms = synonyms + ", " + synonym;
                        }
                    });
                });
                console.log(synonyms);
                // innerHTML += "    * " + synonyms + "<br>";
                // var word = document.createElement("div");
                // console.log(word);
                // var body = document.getElementById("body");
                // console.log(innerHTML);
                // body.innerHTML += innerHTML;
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});







fs.writeFile('input.txt', 'Simply Easy Learning!', function(err) {
   if (err) {
      return console.error(err);
   }
   console.log("Data written successfully!");
   console.log("Let's read newly written data");
   // Read the newly written file and print all of its content on the console
   fs.readFile('input.txt', function (err, data) {
      if (err) {
         return console.error(err);
      }
      console.log("Asynchronous read: " + data.toString());
   });
});