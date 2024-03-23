import { FlashText } from '../src/flashtext';
import RemoverTestCases from './data/remover-test-cases.json';

type RemoverTestCase = {
  sentence: string;
  keyword_dict: Record<string, string[]>;
  remove_keyword_dict: Record<string, string[]>;
  keywords: string[];
  keywords_case_sensitive: string[];
};

describe('Flashtext Remover Test Cases', () => {
  /**
   * For each of the test case initialize a new FlashText.
   * Add the keywords the test case to FlashText.
   * Remove the keywords in remove_keyword_dict
   * Extract keywords and check if they match the expected result for the test case.
   */
  it.each([...(RemoverTestCases as unknown as RemoverTestCase[])])(
    'should remove keywords mentioned in remove_keyword_dict using removeKeywordsFromDict',
    (testCase) => {
      const flashText = new FlashText();

      flashText.addKeywordsFromDict(testCase.keyword_dict);
      flashText.removeKeywordsFromDict(testCase.remove_keyword_dict);
      const result = flashText.extractKeywords(testCase.sentence);

      expect(result).toEqual(testCase.keywords);
    }
  );

  /**
   * For each of the test case initialize a new FlashText.
   * Add the keywords the test case to FlashText.
   * Remove the keywords in remove_keyword_dict
   * Extract keywords and check if they match the expected result for the test case.
   */
  it.each([...(RemoverTestCases as unknown as RemoverTestCase[])])(
    'should remove keywords mentioned in remove_keyword_dict using removeKeywordsFromList',
    (testCase) => {
      const flashText = new FlashText();

      flashText.addKeywordsFromDict(testCase.keyword_dict);
      for (const keyword in testCase.remove_keyword_dict) {
        flashText.removeKeywordsFromList(testCase.remove_keyword_dict[keyword]);
      }
      const result = flashText.extractKeywords(testCase.sentence);

      expect(result).toEqual(testCase.keywords);
    }
  );

  /**
   * For each of the test case initialize a new FlashText.
   * Add the keywords the test case to FlashText.
   * Remove the keywords in remove_keyword_dict
   * Extract keywords and check if they match the expected result for the test case.
   */
  it.each([...(RemoverTestCases as unknown as RemoverTestCase[])])(
    'should produce identical results for the rebuilt dictionary and the original dictionary after removing keywords',
    (testCase) => {
      const flashTextOne = new FlashText();

      flashTextOne.addKeywordsFromDict(testCase.keyword_dict);
      flashTextOne.removeKeywordsFromDict(testCase.remove_keyword_dict);

      const resultOne = flashTextOne.extractKeywords(testCase.sentence);

      const newDictionary: { [key: string]: string[] } = {};

      // Iterate through the keyword_dict
      for (const [key, values] of Object.entries(testCase.keyword_dict)) {
        // Iterate through the values of each key
        for (const value of values) {
          // Check if the key and value combination is not in the remove_keyword_dict
          if (
            !(key in testCase.remove_keyword_dict) ||
            !testCase.remove_keyword_dict[key].includes(value)
          ) {
            // If not, add the value to the new dictionary under the corresponding key
            if (!newDictionary[key]) {
              newDictionary[key] = [];
            }
            newDictionary[key].push(value);
          }
        }
      }

      const flashTextTwo = new FlashText();

      flashTextTwo.addKeywordsFromDict(newDictionary);

      const resultTwo = flashTextTwo.extractKeywords(testCase.sentence);

      expect(resultTwo).toEqual(resultOne);
    }
  );
});
