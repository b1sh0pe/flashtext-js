# flashtext-ts

A Typescript port of Python [flashtext](https://github.com/vi3k6i5/flashtext) package.

This module can be used to replace keywords in sentences or extract keywords from sentences. It is based on the [FlashText algorithm](https://arxiv.org/abs/1711.00046).

## Installation

```
npm install flashtext-ts
yarn add flashtext-ts
pnpm add flashtext-ts
```

## Usage

### Extract keywords
```
const flashtext = new FlashText();

flashtext.addKeyword('Big Apple', 'New York');
flashtext.addKeyword('Bay Area');

const keywordsExtracted = flashtext.extractKeywords('I love Big Apple and Bay Area.');

// keywordsExtracted = ['New York', 'Bay Area']
```

### Replace keywords
```
const flashtext = new FlashText();

flashtext.addKeyword('Big Apple', 'New York');
flashtext.addKeyword('Bay Area', '6ay Area');

const newSentence = flashtext.replaceKeywords('I love Big Apple and Bay Area.');

// newSentence = I love New York and 6ay Area.
```

### Case Sensitive
```
const flashtext = new FlashText(true);

flashtext.addKeyword('Big Apple', 'New York');
flashtext.addKeyword('Bay Area');

const keywordsExtracted = flashtext.extractKeywords('I love big Apple and Bay Area.');

// keywordsExtracted = ['Bay Area']
```

### Span of keywords extracted
```
const flashtext = new FlashText();

flashtext.addKeyword('Big Apple', 'New York');
flashtext.addKeyword('Bay Area');

const keywordsExtracted = flashtext.extractKeywords('I love Big Apple and Bay Area.', true);

/*
  keywordsExtracted = [
    ['New York', 7, 16],
    ['Bay Area', 21, 29]
  ]
*/
```

### Add multiple keywords simultaneously
```
const flashtext = new FlashText();

const keywordMap = {
  "javascript": ["JS", "JScript"],
  "typescript": ["TS", "TScript"],
};

flashtext.addKeywordsFromDict(keywordMap);
flashtext.addKeywordsFromList(["coffeescript", "programming"]);

const keywordsExtracted = flashtext.extractKeywords("I know JS, TS, Coffeescript and just know how to do programming stuff.");

// keywordsExtracted = ['javascript', 'typescript', 'coffeescript', 'programming']
```

### Remove keywords
```
const flashtext = new FlashText();

const keywordMap = {
  "javascript": ["JS", "JScript"],
  "typescript": ["TS", "TScript"],
};

flashtext.addKeywordsFromDict(keywordMap);
flashtext.addKeywordsFromList(["coffeescript", "programming"]);

flashtext.removeKeyword("JS");
flashtext.removeKeywordsFromDict({ JS: ["JScript"] });
flashtext.removeKeywordsFromList(["programming", "coffeescript"]);

const keywordsExtracted = flashtext.extractKeywords("I know JS, TS, Coffeescript and just know how to do programming stuff.");

// keywordsExtracted = ['typescript']
```

### Check number of terms in Flashtext
```
const flashtext = new FlashText();

const keywordMap = {
  "javascript": ["JS", "JScript"],
  "typescript": ["TS", "TScript"],
};

flashtext.addKeywordsFromDict(keywordMap);

const length = flashtext.length;
// length = 4
```

### Check if term is present in the Flashtext
```
const flashtext = new FlashText();

const keywordMap = {
  "javascript": ["JS", "JScript"],
  "typescript": ["TS", "TScript"],
};

flashtext.addKeywordsFromDict(keywordMap);

flashtext.getKeyword('JS'); // "javascript"
flashtext.contains('TS'); // true
```

### Get all keywords in Flashtext
```
const flashtext = new FlashText();

const keywordMap = {
  "javascript": ["JS", "JScript"],
  "typescript": ["TS", "TScript"],
};

flashtext.addKeywordsFromDict(keywordMap);

const keywords = flashtext.getAllKeywords();

/*
  keywords = {
    "js": "javascript",
    "jscript": "javascript",
    "ts": "typescript",
    "tscript": "typescript"
  }
*/
```

### Add characters as part of word
```
const flashtext = new FlashText();

flashtext.addKeyword('Big Apple');
flashtext.extractKeywords('I love Big Apple/Bay Area.'); // ['Big Apple']

flashtext.addNonWordBoundary('/');
flashtext.extractKeywords('I love Big Apple/Bay Area.'); // []
```

## Tests
```
npm run test
yarn test
pnpm test
```

## License
The project is licensed under the MIT license.