import { FlashText } from '../src/flashtext';
import ExtractorTestCases from './data/extractor-test-cases.json';

type ExtractorTestCase = {
  explanation: string;
  keyword_dict: Record<string, string[]>;
  sentence: string;
  keywords: string[];
  keywords_case_sensitive: string[];
};

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
});
