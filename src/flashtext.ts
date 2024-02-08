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

    let currentDict = this._keywordTrieDict;
    let lenCovered = 0;

    for (const char of word) {
      const nextDict = currentDict.get(char);
      if (nextDict instanceof Map) {
        currentDict = nextDict;
        lenCovered++;
      } else {
        break;
      }
    }

    return currentDict.has(this._keyword) && lenCovered === word.length;
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

    let currentDict = this._keywordTrieDict;
    let lenCovered = 0;

    for (const char of word) {
      const nextDict = currentDict.get(char);
      if (nextDict instanceof Map) {
        currentDict = nextDict;
        lenCovered++;
      } else {
        break;
      }
    }

    const keyword = currentDict.get(this._keyword);

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

    let currentDict = this._keywordTrieDict;

    for (const letter of keyword) {
      const nextDict = currentDict.get(letter);
      if (nextDict instanceof Map) {
        currentDict = nextDict;
      } else {
        const newDict = new Map();
        currentDict.set(letter, newDict);
        currentDict = newDict;
      }
    }

    if (!currentDict.has(this._keyword)) {
      status = true;
      this._termsInTrie++;
    }

    currentDict.set(this._keyword, cleanName);

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

    let currentDict: KeywordTrieDictionary | null = this._keywordTrieDict;
    const characterTrieList: KeywordTrieDictionaryCharacterList = [];

    for (const letter of keyword) {
      const nextDict: KeywordTrieDictionaryReturnType = currentDict.get(letter);
      if (nextDict instanceof Map) {
        characterTrieList.push([letter, currentDict]);
        currentDict = nextDict;
      } else {
        // If character is not found, break out of the loop
        currentDict = null;
        break;
      }
    }

    // Remove the characters from trie dict if there are no other keywords with them
    if (currentDict !== null && currentDict.has(this._keyword)) {
      // We found a complete match for input keyword.
      characterTrieList.push([this._keyword, currentDict]);
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
}
