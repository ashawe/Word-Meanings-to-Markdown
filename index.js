let fs = require("fs");
const http = require('https');

// reads words from a txt file (comma separated). O/p Array of words.
function wordsFromFileToArray(fileName) {
    console.log("reading from " + fileName);
    const data = fs.readFileSync('./words1.txt', { encoding: 'utf8', flag: 'r' });
    // console.log(data);
    return data.split(',');
}

// takes a word,output filename as arg. O/p: void. Appends Meaning to filename
function findMeaningFromAPI(word) {
    return new Promise((resolve, reject) => {
        http.get('https://api.dictionaryapi.dev/api/v2/entries/en/' + word, (response) => {
            let chunks_of_data = [];
            response.on('data', (fragments) => {
                chunks_of_data.push(fragments);
            });

            response.on('end', () => {
                let response_body = Buffer.concat(chunks_of_data);
                resolve(response_body.toString());
            });

            response.on('error', (error) => {
                reject(error);
            });
        });
    });
}

function writeMeaningToFile(inputStream,filename) {
    return new Promise((resolve, reject) => {
        let stream = fs.createWriteStream(filename, { flags: 'a' });
        let toWrite = "";
        let result = JSON.parse(inputStream);
        // console.log(JSON.parse(data));
        // let result = data;
        // toWrite += "<details><summary>" + "\n";
        let synonyms = "synonyms: ";
        // console.log("***************************")
        console.log(result[0].word);
        //innerHTML += result[0].word + "</summary>";
        toWrite += "- " + result[0].word + "\n";
        //console.log(result[0].meanings);
        //console.log(result[0].meanings.length);
        result[0].meanings.forEach(meaning => {
            // console.log("" + meaning.partOfSpeech + ": ");
            toWrite += "    - " + meaning.partOfSpeech + "\n";
            //innerHTML += "* " + meaning.partOfSpeech + "<br>";
            meaning.definitions.forEach(definition => {
                // console.log("    - " + definition.definition);
                toWrite += "        - " + definition.definition + "\n";
                //innerHTML += "    * " + definition.definition + "<br>";
                // console.log("    ex: " + definition.example);
                toWrite += "        - ex: " + definition.example + "\n";
                //innerHTML += "    * ex: " + definition.example + "<br>";
                if(definition.synonyms !== undefined)
                {
                    synonyms += " " + definition.synonyms[0];
                    for (let i = 1; i < 5; i++) {
                        const synonym = definition.synonyms[i];
                        synonyms = synonyms + ", " + synonym;
                    }
                }
            });
        });
        // console.log(synonyms);
        toWrite += "        - " + synonyms + "\n";
        // innerHTML += "    * " + synonyms + "<br>";
        // let word = document.createElement("div");
        // console.log(word);
        // let body = document.getElementById("body");
        // console.log(innerHTML);
        // body.innerHTML += innerHTML;
        // toWrite += "</details>";
        console.log("ending stream");
        stream.write(toWrite);
        stream.end();
        // holds response from server that is passed when Promise is resolved
        // console.log(response_body);
        console.log("resolving");
        resolve();
    });
}


async function writeMeaningToFileHandler(word, filename) {
    try {
        let http_promise = findMeaningFromAPI(word);
        let inputStream = await http_promise;
        console.log("got stream");
        let file_writer_promise = writeMeaningToFile(inputStream,filename);
        let dummyVariable = await file_writer_promise;
        console.log("wrote to file");
    }
    catch (error) {
        // Promise rejected
        console.log(error);
    }
}

// Takes a file containing words (comma separated) and output file name as arg 
// and writes meanings to outputFile in markdown
function wordMeaningToMarkdown(inputFileName, outputFileName) {
    let arrayOfWords = wordsFromFileToArray(inputFileName);
    console.log(arrayOfWords);
    arrayOfWords.forEach(word => {
        (async function () {
            // wait to http request to finish
            await writeMeaningToFileHandler(word,outputFileName);
            
            // below code will be executed after http request is finished
            console.log(2);
        })();
    });
}

// findMeaningAndWrite("averse","./words.md");
wordMeaningToMarkdown("./words1.txt", "./words.md");