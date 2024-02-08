export type KeywordTrieDictionary = Map<string, KeywordTrieDictionary | string>;

export type KeywordTrieDictionaryReturnType =
  | KeywordTrieDictionary
  | undefined
  | string;

export type KeywordTrieDictionaryCharacterList = Array<
  [string, KeywordTrieDictionary]
>;
