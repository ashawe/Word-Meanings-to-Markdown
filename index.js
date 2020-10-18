/*

```A Program to find meanings of words from Google's Dictionary and write necessary details in markdown format.```

Points to remember: Skips words whose definition isn't found.

API USED: https://github.com/meetDeveloper/googleDictionaryAPI
API ENDPOINT: https://api.dictionaryapi.dev/api/v2/entries/<lanuage-code>/<word>
AUTHOR: AshAwe (https://github.com/ashawe)

*/

let fs = require("fs");
const http = require('https');

/**
 * Reads words from a txt file (comma separated) and returns an array of array of words.
 *
 * @param {String}   fileName             
 * @param {BigInteger}   chunkSize        
 *
 * @return {Array} Returns a 2D array containing chunkSize length of elements in a row ( or less in the last one ) and the number of rows = total words / chunkSize.
 */
function wordsFromFileToArray(fileName,chunkSize) {
    const data = fs.readFileSync(fileName, { encoding: 'utf8', flag: 'r' });
    let arrOfArrOfWords = [];
    let arrOfWords = data.split(',');
    var i, j, tempArray, k = 0;
    var chunk = chunkSize == 0 ? arrOfWords.length : chunkSize; // if output to one file only ( chunkSize is 0 )
    for (i = 0, j = arrOfWords.length; i < j; i += chunk) {
        tempArray = arrOfWords.slice(i, i + chunk);
        arrOfArrOfWords[k] = tempArray;
        k++;
    }
    // console.log(arrOfArrOfWords);
    return arrOfArrOfWords;
}

/**
 * A synchronous function that finds the meaning of given word using the dictionary API.
 *
 * @param {String}   word             The word whose meaning is to be found
 *
 * @return {JSON} Returns JSON as returned by the API.
 */
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

/**
 * The file writing function which writes meanings to the file.
 * 
 * This function writes word, its part of speech, definition and synonyms to "filename" ( second argument to the function ) in markdown.
 *
 * @param {JSON}   inputStream        Takes JSON input as returned by the dictionary API.
 * @param {String}   filename         The path of file where the meaning is to be written
 *
 * @return {undefined} Returns nothing.
 */
function writeMeaningToFile(inputStream, filename) {
    let stream = fs.createWriteStream(filename, { flags: 'a' });
    let toWrite = "";
    let result = JSON.parse(inputStream);
    let synonyms = "synonyms: ";
    let synonymsList = [];
    let isSynonymAvailable = false;
    if (result[0] === undefined) return; // return if no word definition is found
    toWrite += "- " + result[0].word + "\n";
    result[0].meanings.forEach(meaning => {
        toWrite += "    - " + meaning.partOfSpeech + "\n";
        meaning.definitions.forEach(definition => {
            toWrite += "        - " + definition.definition + "\n";
            if(definition.example !== undefined){
                toWrite += "            - ex: " + definition.example + "\n";
            }
            if (definition.synonyms !== undefined) {
                isSynonymAvailable = true;
                synonymsList.push(...definition.synonyms)
            }
        });
    });
    if (isSynonymAvailable)
        // remove duplicate and write comma separated synonyms
        toWrite += "    - " + synonyms + [...new Set(synonymsList)].join(', ') + "\n";
    stream.write(toWrite);
    stream.end();
}

/**
 * A handler function to wait for the HTTP response and then call function which writes meaning to file.
 * 
 * This is used to make the process synchronous. This is just a handler function which finds meaning using findMeaningFromAPI function and writes it to a file using writeMeaningToFile function
 *
 * @param {String}   word             The word whose meaning is to be found
 * @param {String}   filename         The path of file where the meaning is to be written
 *
 * @return {undefined} Returns nothing.
 */
async function waitAndWriteMeaningToFileHandler(word, filename) {
    try {
        let http_promise = findMeaningFromAPI(word);
        let inputStream = await http_promise;
        writeMeaningToFile(inputStream, filename);
    }
    catch (error) {
        // Promise rejected
        console.log(error);
    }
}

/**
 * The main handler function which takes comma separated words in a file and outputs the meanings of those words in markdown format.
 *
 * In case of chunks the output file names will be "outputFileName"0.md, "outputFileName"1.md and so on where "outputFileName" is the second input param.
 *
 * @param {String}   inputFileName          Path to file that contains the words.
 * @param {String}   outputFileName         Path to file where the output will be stored.
 * @param {BigInteger}   [chunkSize=0]      Number of word meanings that are to be written in a file.
 *
 * @return {undefined} Returns nothing.
 */
function wordMeaningToMarkdown(inputFileName, outputFileName, chunkSize = 0) {
    let arrayOfArrayOfWords = wordsFromFileToArray(inputFileName,chunkSize);
    let changedFileName = outputFileName;
    let arrayOfFileName = outputFileName.split(".");
    for (let i = 0; i < arrayOfArrayOfWords.length; i++) {
        const arrayOfWords = arrayOfArrayOfWords[i];
        changedFileName = arrayOfFileName[0] + "" + i + "." + arrayOfFileName[1];
        arrayOfWords.forEach(word => {
            (async function () {
                // wait to http request to finish
                await waitAndWriteMeaningToFileHandler(word, changedFileName);
            })();
        });
    }
}

wordMeaningToMarkdown("words1.txt", "words.md",50);    // for output in one file do not provide anything
