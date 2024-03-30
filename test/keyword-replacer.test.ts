import { FlashText } from '../src/flashtext';
import ExtractorTestCases from './data/extractor-test-cases.json';

type ExtractorTestCase = {
  explanation: string;
  keyword_dict: Record<string, string[]>;
  sentence: string;
  keywords: string[];
  keywords_case_sensitive: string[];
};

describe('Keyword Replacer', () => {
  function escapeRegExp(string: string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
  }

  it.each([
    ...(ExtractorTestCases as unknown as ExtractorTestCase[]).map(
      (testCase: ExtractorTestCase) =>
        [testCase.explanation, testCase] as [string, ExtractorTestCase]
    ),
  ])(`%s`, (_, testCase) => {
    const flashText = new FlashText();

    for (const [key, values] of Object.entries(testCase.keyword_dict)) {
      for (const value of values) {
        flashText.addKeyword(value, key.replaceAll(' ', '_'));
      }
    }

    let sentence = testCase.sentence;
    const newSentence = flashText.replaceKeywords(sentence);

    const keywordMapping = new Map();
    for (const [key, values] of Object.entries(testCase.keyword_dict)) {
      for (const value of values) {
        keywordMapping.set(value, key.replaceAll(' ', '_'));
      }
    }

    const sortedKeys = [...keywordMapping.keys()].sort(
      (a, b) => b.length - a.length
    );

    for (const key of sortedKeys) {
      const regex = new RegExp(`(?<!\\w)${escapeRegExp(key)}(?!\\w)`, 'g');
      sentence = sentence.replace(regex, keywordMapping.get(key));
    }

    expect(newSentence).toEqual(sentence);
  });
});

describe('Keyword Replacer Cases', () => {
  it('should return the same sentence if the sentence is invalid', () => {
    const flashText = new FlashText();

    const sentence = '';
    const newSentence = flashText.replaceKeywords(sentence);

    expect(newSentence).toEqual(sentence);
  });
});
