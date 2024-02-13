import { FlashText } from '../src/flashtext';

describe('Keyword Extractor Test Cases', () => {
  it('should return keyword at the end of the string', () => {
    const keywordExtractor = new FlashText();

    keywordExtractor.addKeyword('Javascript');
    const result = keywordExtractor.extractKeywords('I like Javascript');

    expect(result).toEqual(['Javascript']);
  });

  it('should not return keyword if it is incomplete at the end of the string', () => {
    const keywordExtractor = new FlashText();

    keywordExtractor.addKeyword('Javascript');
    const result = keywordExtractor.extractKeywords('I like Java');

    expect(result).toEqual([]);
  });
});
