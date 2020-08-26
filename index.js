var fs = require("fs");
const https = require('https');

// bring data
https.get('https://api.dictionaryapi.dev/api/v2/entries/en/averse', (resp) => {

    let data = '';
    // A chunk of data has been received.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // https://stackoverflow.com/questions/3459476/how-to-append-to-a-file-in-node/43370201#43370201
    resp.on('end', () => {
        var stream = fs.createWriteStream("words.md", { flags: 'a' });
        var result = JSON.parse(data);
        // console.log(JSON.parse(data));
        // var result = data;
        // stream.write("<details><summary>" + "\n");
        var synonyms = "synonyms: ";
        // console.log("***************************")
        console.log(result[0].word);
        //innerHTML += result[0].word + "</summary>";
        stream.write("- " + result[0].word + "\n");
        //console.log(result[0].meanings);
        //console.log(result[0].meanings.length);
        result[0].meanings.forEach(meaning => {
            // console.log("" + meaning.partOfSpeech + ": ");
            stream.write("    - " + meaning.partOfSpeech + "\n");
            //innerHTML += "* " + meaning.partOfSpeech + "<br>";
            meaning.definitions.forEach(definition => {
                // console.log("    - " + definition.definition);
                stream.write("        - " + definition.definition + "\n");
                //innerHTML += "    * " + definition.definition + "<br>";
                // console.log("    ex: " + definition.example);
                stream.write("        - ex:" + definition.example + "\n");
                //innerHTML += "    * ex: " + definition.example + "<br>";
                synonyms += " " + definition.synonyms[0];
                for (let i = 1; i < 5; i++) {
                    const synonym = definition.synonyms[i];
                    synonyms = synonyms + ", " + synonym;
                }
            });
        });
        // console.log(synonyms);
        stream.write("        - " + synonyms + "\n");
        // innerHTML += "    * " + synonyms + "<br>";
        // var word = document.createElement("div");
        // console.log(word);
        // var body = document.getElementById("body");
        // console.log(innerHTML);
        // body.innerHTML += innerHTML;
        // stream.write("</details>");
        stream.end();
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});