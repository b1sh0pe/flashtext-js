export type KeywordTrieDictionary = Map<string, KeywordTrieDictionary | string>;

export type KeywordTrieDictionaryReturnType = ReturnType<
  KeywordTrieDictionary['get']
>;

export type KeywordTrieDictionaryCharacterList = Array<
  [string, KeywordTrieDictionary]
>;

export type KeywordTrieDictionaryExtractResult = Array<
  string | [string, number, number]
>;
