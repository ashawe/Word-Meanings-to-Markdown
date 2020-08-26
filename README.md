# Words' Meanings to Markdown File Generator
## A Program to find meanings of words from Google's Dictionary and write necessary details in markdown format.

### INPUT: 
A file (containing comma separated words whose meanings are to be found).

### OUTPUT:
A markdown file with the word, its part of speech, definition and synonyms.

### How to use:
1. Create an input file ex. words.txt with words whose meanings are to be found:
```
allusion,inclement,atrophy,averse,transcend
```

2. Change the input and output file path in the last line of the code.
``` wordMeaningToMarkdown("./words1.txt", "./words.md"); ```

3. Run the file using node
``` node index.js ```

### Sample:
<details>
<summary>Sample Input</summary>

```
allusion,inclement,atrophy
```
</details>

<details>
<summary>Sample Output</summary>

- inclement
    - adjective
        - (of the weather) unpleasantly cold or wet.
        - ex: walkers should be prepared for inclement weather
        - synonyms:  cold, chilly, bitter, bleak, raw
- allusion
    - noun
        - An expression designed to call something to mind without mentioning it explicitly; an indirect or passing reference.
        - ex: an allusion to Shakespeare
        - synonyms:  reference to, mention of, comment on, remark about, citation of
- atrophy
    - intransitive verb
        - (of body tissue or an organ) waste away, especially as a result of the degeneration of cells, or become vestigial during evolution.
        - ex: without exercise, the muscles will atrophy
        - Gradually decline in effectiveness or vigor due to underuse or neglect.
        - ex: her artistic skills atrophied from lack of use
    - noun
        - The process of atrophying or state of having atrophied.
        - ex: gastric atrophy
        - synonyms:  waste away, waste, become emaciated, wither, shrivel peter out, taper off, tail off, dwindle, deteriorate wasting, wasting away, emaciation, withering, shrivelling
</details>