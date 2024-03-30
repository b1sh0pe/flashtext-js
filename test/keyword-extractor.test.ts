import { FlashText } from '../src/flashtext';
import ExtractorTestCases from './data/extractor-test-cases.json';

type ExtractorTestCase = {
  explanation: string;
  keyword_dict: Record<string, string[]>;
  sentence: string;
  keywords: string[];
  keywords_case_sensitive: string[];
};

/**
 * For each of the test case initialize a new FlashText.
 * Add the keywords the test case to FlashText.
 * Extract keywords and check if they match the expected result for the test case.
 */
describe('Flashword Extractor Test Cases', () => {
  describe('Case Insensitive', () => {
    it.each([
      ...(ExtractorTestCases as unknown as ExtractorTestCase[]).map(
        (testCase: ExtractorTestCase) =>
          [testCase.explanation, testCase] as [string, ExtractorTestCase]
      ),
    ])(`%s`, (_, testCase) => {
      const flashText = new FlashText();
      flashText.addKeywordsFromDict(testCase?.keyword_dict);
      const result = flashText.extractKeywords(testCase.sentence);
      expect(result).toEqual(testCase.keywords);
    });
  });

  describe('Case Sensitive', () => {
    it.each([
      ...(ExtractorTestCases as unknown as ExtractorTestCase[]).map(
        (testCase: ExtractorTestCase) =>
          [testCase.explanation, testCase] as [string, ExtractorTestCase]
      ),
    ])(`%s`, (_, testCase) => {
      const flashText = new FlashText(true);
      flashText.addKeywordsFromDict(testCase?.keyword_dict);
      const result = flashText.extractKeywords(testCase.sentence);
      expect(result).toEqual(testCase.keywords_case_sensitive);
    });
  });

  describe('Span information - Case Insensitive', () => {
    it.each([
      ...(ExtractorTestCases as unknown as ExtractorTestCase[]).map(
        (testCase: ExtractorTestCase) =>
          [testCase.explanation, testCase] as [string, ExtractorTestCase]
      ),
    ])(`%s`, (_, testCase) => {
      const flashText = new FlashText();
      for (const key of Object.keys(testCase.keyword_dict)) {
        flashText.addKeywordsFromList(testCase.keyword_dict[key]);
      }

      const result = flashText.extractKeywords(testCase.sentence, true);

      for (const keywordData of result) {
        const [keyword, start, end] = keywordData as [string, number, number];
        expect(testCase.sentence.toLowerCase().slice(start, end)).toBe(
          String(keyword).toLowerCase()
        );
      }
    });
  });

  describe('Span information - Case Sensitive', () => {
    it.each([
      ...(ExtractorTestCases as unknown as ExtractorTestCase[]).map(
        (testCase: ExtractorTestCase) =>
          [testCase.explanation, testCase] as [string, ExtractorTestCase]
      ),
    ])(`%s`, (_, testCase) => {
      const flashText = new FlashText(true);
      for (const key of Object.keys(testCase.keyword_dict)) {
        flashText.addKeywordsFromList(testCase.keyword_dict[key]);
      }

      const result = flashText.extractKeywords(testCase.sentence, true);

      for (const keywordData of result) {
        const [keyword, start, end] = keywordData as [string, number, number];
        expect(testCase.sentence.slice(start, end)).toBe(String(keyword));
      }
    });
  });

  it('should return empty array if no keywords are found', () => {
    const flashText = new FlashText();

    const result = flashText.extractKeywords('This is a test sentence');

    expect(result).toEqual([]);
  });

  it('should return empty array if the sentence is invalid', () => {
    const flashText = new FlashText(true);

    const result = flashText.extractKeywords('');

    expect(result).toEqual([]);
  });
});
