import type {
  KeywordTrieDictionary,
  KeywordTrieDictionaryCharacterList,
  KeywordTrieDictionaryReturnType,
} from './types';

export class FlashText {
  /**
   * @param keyword - The keyword to be added to the trie.
   */
  private _keyword: string;
  /**
   * @param whiteSpaceChars - A set of characters that are considered as white space.
   */
  private _whiteSpaceChars: Set<string>;
  /**
   * @param nonWordBoundaries - A set of characters that are considered as non-word boundaries.
   */
  private _nonWordBoundaries: Set<string>;
  /**
   * @param keywordTrieDict - A trie data structure that holds the keywords.
   */
  private _keywordTrieDict: KeywordTrieDictionary;
  /**
   * @param caseSensitive - A boolean to set whether the search should be case-sensitive.
   */
  private _caseSensitive: boolean;
  /**
   * @param termsInTrie - The number of terms in the trie.
   */
  private _termsInTrie: number;

  /**
   *
   * @param caseSensitive - Default is false. Set to true if the search should be case-sensitive.
   */
  constructor(caseSensitive: boolean = false) {
    this._keyword = '_keyword_';
    this._whiteSpaceChars = new Set(['.', '\t', '\n', 'a', ' ', ',']);

    // Defining non-word boundaries based on Python's string module in TypeScript
    const digits = '0123456789';
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this._nonWordBoundaries = new Set([...digits, ...letters.split(''), '_']);

    this._keywordTrieDict = new Map();
    this._caseSensitive = caseSensitive;
    this._termsInTrie = 0;
  }

  /**
   * @returns Number of terms present in the keyword trie dictionary.
   */
  public length(): number {
    return this._termsInTrie;
  }

  /**
   *
   * @param word - The word that needs to be checked.
   * @returns A boolean indicating whether the word is present in the keyword trie dictionary.
   */
  public contains(word: string): boolean {
    if (!this._caseSensitive) {
      word = word.toLowerCase();
    }

    let currentElemInDict = this._keywordTrieDict;
    let lenCovered = 0;

    for (const char of word) {
      const nextElemInDict = currentElemInDict.get(char);
      if (nextElemInDict instanceof Map) {
        currentElemInDict = nextElemInDict;
        lenCovered++;
      } else {
        break;
      }
    }

    return currentElemInDict.has(this._keyword) && lenCovered === word.length;
  }

  /**
   * If word is present in keyword trie dictionary, return the clean name for it.
   * @param word - The word that needs to be checked.
   * @returns The clean name for the word if it is present in the keyword trie dictionary, else undefined.
   */
  private _getItem(word: string): string | undefined {
    if (!this._caseSensitive) {
      word = word.toLowerCase();
    }

    let currentElemInDict = this._keywordTrieDict;
    let lenCovered = 0;

    for (const char of word) {
      const nextElemInDict = currentElemInDict.get(char);
      if (nextElemInDict instanceof Map) {
        currentElemInDict = nextElemInDict;
        lenCovered++;
      } else {
        break;
      }
    }

    const keyword = currentElemInDict.get(this._keyword);

    if (!(keyword instanceof Map) && lenCovered === word.length) {
      return keyword;
    }

    return;
  }

  /**
   * To add keyword to the dictionary, pass the keyword and the clean name it maps to.
   * @param keyword The keyword to be added to the trie.
   * @param cleanName The clean term for the keyword. If not provided, the keyword is used as the clean name.
   * @returns Status of the operation. True if the keyword was added to the trie, else false.
   */
  private _setItem(keyword: string, cleanName: string | null = null): boolean {
    let status = false;

    if (!keyword) {
      // If keyword is empty, return false.
      return status;
    }

    if (cleanName === null) {
      cleanName = keyword;
    }

    if (!this._caseSensitive) {
      keyword = keyword.toLowerCase();
    }

    let currentElemInDict = this._keywordTrieDict;

    for (const letter of keyword) {
      const nextElemInDict = currentElemInDict.get(letter);
      if (nextElemInDict instanceof Map) {
        currentElemInDict = nextElemInDict;
      } else {
        const newDict = new Map();
        currentElemInDict.set(letter, newDict);
        currentElemInDict = newDict;
      }
    }

    if (!currentElemInDict.has(this._keyword)) {
      currentElemInDict.set(this._keyword, cleanName);
      status = true;
      this._termsInTrie++;
    }

    return status;
  }

  /**
   * To delete a keyword from the dictionary, pass the keyword.
   * @param keyword The keyword to be deleted from the trie.
   * @returns Status of the operation. True if the keyword was deleted from the trie, else false.
   */
  private _deleteItem(keyword: string): boolean {
    let status = false;

    if (!keyword) {
      // If keyword is empty, return false.
      return status;
    }

    if (!this._caseSensitive) {
      keyword = keyword.toLowerCase();
    }

    let currentElemInDict: KeywordTrieDictionary | null = this._keywordTrieDict;
    const characterTrieList: KeywordTrieDictionaryCharacterList = [];

    for (const letter of keyword) {
      const nextElemInDict: KeywordTrieDictionaryReturnType =
        currentElemInDict.get(letter);
      if (nextElemInDict instanceof Map) {
        characterTrieList.push([letter, currentElemInDict]);
        currentElemInDict = nextElemInDict;
      } else {
        // If character is not found, break out of the loop
        currentElemInDict = null;
        break;
      }
    }

    // Remove the characters from trie dict if there are no other keywords with them
    if (currentElemInDict !== null && currentElemInDict.has(this._keyword)) {
      // We found a complete match for input keyword.
      characterTrieList.push([this._keyword, currentElemInDict]);
      characterTrieList.reverse();

      for (const [keyToRemove, dictPointer] of characterTrieList) {
        if (dictPointer.size === 1) {
          dictPointer.delete(keyToRemove);
        } else {
          // More than one key means more than 1 path.
          // Delete not required path and keep the other
          dictPointer.delete(keyToRemove);
          break;
        }
      }

      // Successfully removed keyword
      status = true;
      this._termsInTrie--;
    }

    return status;
  }

  /**
   * Set own non-word boundaries.
   * @param nonWordBoundaries - A set of characters that are considered as non-word boundaries.
   */
  public setNonWordBoundaries(nonWordBoundaries: Set<string>): void {
    this._nonWordBoundaries = nonWordBoundaries;
  }

  /**
   * Add non-word boundary to the existing set of non-word boundaries.
   * @param nonWordBoundary - A character that is considered as a non-word boundary.
   */
  public addNonWordBoundary(nonWordBoundary: string): void {
    this._nonWordBoundaries.add(nonWordBoundary);
  }

  /**
   * @param keyword - The keyword to be added to the trie.
   * @param cleanName - The clean term for the keyword. If not provided, the keyword is used as the clean name.
   * @returns Status of the operation. True if the keyword was added to the trie, else false.
   */
  public addKeyword(keyword: string, cleanName: string | null = null): boolean {
    return this._setItem(keyword, cleanName);
  }

  /**
   * @param keyword - The keyword to be removed.
   * @returns Status of the operation. True if the keyword was removed from the trie, else false.
   */
  public removeKeyword(keyword: string): boolean {
    return this._deleteItem(keyword);
  }

  /**
   * If word is present in keyword trie dictionary, return the clean name for it.
   * @param word - The word that needs to be checked.
   * @returns The clean name for the word if it is present in the keyword trie dictionary, else undefined.
   */
  public getKeyword(keyword: string): string | undefined {
    return this._getItem(keyword);
  }

  /**
   * Add keywords from a list to the trie.
   * Example:
   * ```
   * const flashtext = new FlashText();
   * flashtext.addKeywordsFromDict({
   *  "typescript": ["TS", "TScript"],
   *  "javascript": ["JS", "ECMAScript"]
   * });
   * ```
   * @param keywordDict - A dictionary of keywords where the key is the clean name and the value is a list of keywords.
   */
  public addKeywordsFromDict(keywordDict: Record<string, string[]>): void {
    for (const [cleanName, keywords] of Object.entries(keywordDict)) {
      if (!Array.isArray(keywords)) {
        throw new Error(`Value of key ${cleanName} should be a list`);
      }

      for (const keyword of keywords) {
        this.addKeyword(keyword, cleanName);
      }
    }
  }

  /**
   * Remove keywords from a list to the trie.
   * Example:
   * ```
   * const flashtext = new FlashText();
   * flashtext.removeKeywordsFromDict({
   *  "typescript": ["TS", "TScript"],
   *  "javascript": ["JS", "ECMAScript"]
   * });
   * ```
   * @param keywordDict - A dictionary of keywords where the key is the clean name and the value is a list of keywords.
   */
  public removeKeywordsFromDict(keywordDict: Record<string, string[]>): void {
    for (const [cleanName, keywords] of Object.entries(keywordDict)) {
      if (!Array.isArray(keywords)) {
        throw new Error(`Value of key ${cleanName} should be a list`);
      }

      for (const keyword of keywords) {
        this.removeKeyword(keyword);
      }
    }
  }

  /**
   * Add keywords from a list to the trie.
   * Example:
   * ```
   * const flashtext = new FlashText();
   * flashtext.addKeywordsFromList(["typescript", "javascript"]);
   * ```
   * @param keywordList - A list of keywords.
   */
  public addKeywordsFromList(keywordList: string[]): void {
    if (!Array.isArray(keywordList)) {
      throw new Error('keywordList should be a list');
    }

    for (const keyword of keywordList) {
      this.addKeyword(keyword);
    }
  }

  /**
   * Remove keywords from a list to the trie.
   * Example:
   * ```
   * const flashtext = new FlashText();
   * flashtext.removeKeywordsFromList(["typescript", "javascript"]);
   * ```
   * @param keywordList - A list of keywords.
   */
  public removeKeywordsFromList(keywordList: string[]): void {
    if (!Array.isArray(keywordList)) {
      throw new Error('keywordList should be a list');
    }

    for (const keyword of keywordList) {
      this.removeKeyword(keyword);
    }
  }

  /**
   * Recursive function to get all keywords from the keyword trie dictionary.
   * @param termSoFar - Term built so far by adding all previous characters.
   * @param currentElemInDict - current recursive position in dictionary
   * @param allKeywords - A dictionary of keywords present in the dictionary and the clean name mapped to those keywords.
   * @returns A map of key and value where each key is a term in the keyword trie dictionary and value mapped to it is the clean name mapped to it.
   */
  private _getAllKeywords(
    termSoFar: string,
    currentElemInDict: KeywordTrieDictionary,
  ): Record<string, string> {
    const allKeywords: Record<string, string> = {};

    for (const [char, nextElemInDict] of currentElemInDict) {
      if (char === this._keyword) {
        allKeywords[termSoFar] = nextElemInDict as string;
      } else if (nextElemInDict instanceof Map) {
        this._getAllKeywords(termSoFar + char, nextElemInDict);
      }
    }

    return allKeywords;
  }

  /**
   * Recursively builds a dictionary of keywords present in the dictionary and the clean name mapped to those keywords.
   * Example:
   * ```
   * const flashtext = new FlashText();
   * flashtext.addKeyword('JS', 'Javascript');
   * flashtext.addKeyword('TS', 'Typescript');
   * const allKeywords = flashtext.getAllKeywords();
   *
   * // Output - {'JS': 'Javascript', 'TS': 'Typescript'}
   * ```
   * @returns A map of key and value where each key is a term in the keyword trie dictionary and value mapped to it is the clean name mapped to it.
   */
  public getAllKeywords(): Record<string, string> {
    return this._getAllKeywords('', this._keywordTrieDict);
  }

  /**
   * Retrieve the next word in the sequence. Iterate in the string until finding the first char not in non_word_boundaries
   * @param sentence - Line of text where we will look for the next word.
   * @returns The next word in the sentence.
   */
  private _getNextWord(sentence: string): string {
    let nextWord = '';

    for (const char of sentence) {
      if (!this._nonWordBoundaries.has(char)) {
        break;
      }
      nextWord += char;
    }

    return nextWord;
  }

  /**
   * Retrieve the nodes where there is a fuzzy match, via levenshtein distance, and with respect to max_cost
   * @param word - word to find a fuzzy match for
   * @param maxCost - maximum levenshtein distance when performing the fuzzy match
   * @param startNode - Trie node from which the search is performed
   * @returns A tuple containing the final node, the cost (i.e the distance), and the depth in the trie.
   */
  private *_levensthein(
    word: string,
    maxCost: number = 2,
    startNode: KeywordTrieDictionary | null = null,
  ): Generator<[KeywordTrieDictionary, number, number]> {
    startNode = startNode || this._keywordTrieDict;
    const rows = [...Array(word.length + 1).keys()];

    for (const [char, node] of startNode) {
      yield* this._levenshteinRec(
        char,
        node as KeywordTrieDictionary,
        word,
        rows,
        maxCost,
        1,
      );
    }
  }

  private *_levenshteinRec(
    char: string,
    node: KeywordTrieDictionary,
    word: string,
    rows: number[],
    maxCost: number,
    depth: number = 0,
  ): Generator<[KeywordTrieDictionary, number, number]> {
    const nColumns = word.length + 1;
    const newRows: number[] = [rows[0] + 1];
    let cost = 0;

    for (let col = 1; col < nColumns; col++) {
      const insertCost = newRows[col - 1] + 1;
      const deleteCost = rows[col] + 1;
      const replaceCost = rows[col - 1] + (word[col - 1] !== char ? 1 : 0);
      cost = Math.min(insertCost, deleteCost, replaceCost);
      newRows.push(cost);
    }

    const stopCrit =
      node instanceof Map &&
      [...node.keys()].some(
        (key) => this._whiteSpaceChars.has(key) || key === this._keyword,
      );

    if (newRows[newRows.length - 1] <= maxCost && stopCrit) {
      yield [node, cost, depth];
    } else if (node instanceof Map && Math.min(...newRows) <= maxCost) {
      for (const [newChar, newNode] of Object.entries(node)) {
        yield* this._levenshteinRec(
          newChar,
          newNode,
          word,
          newRows,
          maxCost,
          depth + 1,
        );
      }
    }
  }

  /**
   * Extract keywords from a sentence.
   * Example:
   * ```
   * const flashtext = new FlashText();
   * flashtext.addKeyword('JS', 'Javascript');
   * flashtext.addKeyword('TS', 'Typescript');
   * const keywords = flashtext.extractKeywords('TS is better than JS');
   *
   * // Output - ['Javascript', 'Typescript']
   * ```
   * @param sentence - The sentence from which keywords need to be extracted.
   * @param spanInfo - If true, the output will contain the start and end position of the keyword in the sentence.
   * @param maxCost - The maximum levenshtein distance when performing the fuzzy match.
   * @returns A list of keywords extracted from the sentence.
   */
  public extractKeywords(
    sentence: string,
    spanInfo: boolean = false,
    maxCost: number = 0,
  ): Array<string | [string, number, number]> {
    const keywordsExtracted: Array<string | [string, number, number]> = [];

    if (!sentence) {
      return [];
    }

    if (!this._caseSensitive) {
      sentence = sentence.toLowerCase();
    }

    let currentDict: KeywordTrieDictionary = this._keywordTrieDict;
    let sequenceStartPos = 0;
    let sequenceEndPos = 0;
    let resetCurrentDict = false;
    let idx = 0;

    const sentenceLen = sentence.length;
    let currCost = maxCost;

    while (idx < sentenceLen) {
      const char = sentence.charAt(idx);

      if (!(char in this._nonWordBoundaries)) {
        if (this._keyword in currentDict || char in currentDict) {
          let longestSequenceFound: string | undefined = undefined;
          let isLongerSeqFound = false;

          if (this._keyword in currentDict) {
            const currentDictElem = currentDict.get(this._keyword) as string;
            longestSequenceFound = currentDictElem;
            sequenceEndPos = idx;
          }

          if (char in currentDict) {
            let currentDictContinued: KeywordTrieDictionary | undefined =
              currentDict.get(char) as KeywordTrieDictionary;
            let idy = idx + 1;

            while (idy < sentenceLen) {
              const innerChar = sentence[idy];
              if (
                innerChar.match(/\W/) &&
                !(innerChar in this._nonWordBoundaries) &&
                currentDictContinued?.get(this._keyword)
              ) {
                longestSequenceFound = currentDictContinued.get(
                  this._keyword,
                ) as string;
                sequenceEndPos = idy;
                isLongerSeqFound = true;
              }

              if (currentDictContinued?.has(innerChar)) {
                currentDictContinued = currentDictContinued.get(
                  innerChar,
                ) as KeywordTrieDictionary;
              } else if (currCost > 0) {
                const nextWord = sentence.slice(
                  idy,
                  idy + this._getNextWord(sentence.slice(idy)).length,
                );
                [currentDictContinued, currCost] = this._levensthein(
                  nextWord,
                  currCost,
                  currentDictContinued,
                ).next();
                idy += nextWord.length - 1;
                if (!currentDictContinued) {
                  break;
                }
              } else {
                break;
              }

              idy++;
            }

            if (currentDictContinued?.has(this._keyword)) {
              longestSequenceFound = currentDictContinued.get(
                this._keyword,
              ) as string;
              sequenceEndPos = idy;
              isLongerSeqFound = true;
            }

            if (isLongerSeqFound) {
              idx = sequenceEndPos;
            }
          }

          currentDict = this._keywordTrieDict;

          if (longestSequenceFound) {
            keywordsExtracted.push([
              longestSequenceFound,
              sequenceStartPos,
              idx,
            ]);

            currCost = maxCost;
          }

          resetCurrentDict = true;
        } else {
          currentDict = this._keywordTrieDict;

          resetCurrentDict = true;
        }
      } else if (char in currentDict) {
        currentDict = currentDict.get(char) as KeywordTrieDictionary;
      } else if (currCost > 0) {
        const nextWord = sentence.slice(
          idx,
          idx + this._getNextWord(sentence.slice(idx)).length,
        );
        [currentDict, currCost] = this._levensthein(
          nextWord,
          currCost,
          currentDict,
        ).next();
        idx += nextWord.length - 1;
      } else {
        currentDict = this._keywordTrieDict;

        resetCurrentDict = true;

        let idy = idx + 1;
        while (idy < sentenceLen) {
          const char = sentence.charAt(idy);
          if (char.match(/\W/) && !(char in this._nonWordBoundaries)) {
            break;
          }

          idy++;
        }

        idx = idy;
      }

      if (idx + 1 >= sentenceLen && this._keyword in currentDict) {
        const sequenceFound = currentDict.get(this._keyword) as string;
        keywordsExtracted.push([sequenceFound, sequenceStartPos, sentenceLen]);
      }

      idx++;

      if (resetCurrentDict) {
        resetCurrentDict = false;
        sequenceStartPos = idx;
      }
    }

    if (spanInfo) {
      return keywordsExtracted;
    }

    return keywordsExtracted.map((value) => value[0]);
  }
}
