import { KeywordTrieDictionary } from '../src/types';
import { FlashText } from '../src/flashtext';

const getNodeByPath = (
  keywordDict: KeywordTrieDictionary,
  path: string[]
): KeywordTrieDictionary => {
  let currentNode = keywordDict;
  for (const letter of path) {
    const value = currentNode.get(letter);
    if (typeof value === 'object') {
      currentNode = value;
    }
  }

  return currentNode;
};

describe('Fuzzy Extractor Test Cases', () => {
  it('should extract keywords with a fuzzy match if there is less letters', () => {
    const flashText = new FlashText();
    flashText.addKeyword('Telegram', 'Messenger');

    const sentence = 'Hello, do you have Telegam?';
    const expectedResult = [['Messenger', 19, 26]];

    const keywordsExtracted = flashText.extractKeywords(sentence, true, 1);
    expect(keywordsExtracted).toEqual(expectedResult);
  });

  it('should extract keywords with a fuzzy match if there is more letters', () => {
    const flashText = new FlashText();
    flashText.addKeyword('colour here', 'couleur ici');
    flashText.addKeyword('and heere', 'et ici');

    const sentence = 'color here blabla and here';
    const expectedResult = [
      ['couleur ici', 0, 10],
      ['et ici', 18, 26],
    ];

    const keywordsExtracted = flashText.extractKeywords(sentence, true, 1);
    expect(keywordsExtracted).toEqual(expectedResult);
  });

  it('[additions] should end up on the right node in the trie when starting from the current node', () => {
    const flashText = new FlashText();
    flashText.addKeyword('colour here', 'couleur ici');
    flashText.addKeyword('and heere', 'et ici');

    const keywordDict: KeywordTrieDictionary = flashText.trie;

    const currentNode = getNodeByPath(keywordDict, ['c', 'o', 'l', 'o']);

    const [closestNode, cost, depth] = flashText
      .levensthein('r', 1, currentNode, [new Map(), 0, 0])
      .next().value;
    expect(closestNode).toEqual(getNodeByPath(currentNode, ['u', 'r']));
    expect(cost).toEqual(1);
    expect(depth).toEqual(2);

    const currentNodeContinued = getNodeByPath(keywordDict, [
      'a',
      'n',
      'd',
      ' ',
      'h',
    ]);
    const [closestNodeContinued, costContinued, depthContinued] = flashText
      .levensthein('ere', 1, currentNodeContinued, [new Map(), 0, 0])
      .next().value;
    expect(closestNodeContinued).toEqual(
      getNodeByPath(currentNodeContinued, ['e', 'e', 'r', 'e'])
    );
    expect(costContinued).toEqual(1);
    expect(depthContinued).toEqual(4);
  });

  it('[deletions] should end up on the right node in the trie when starting from the current node', () => {
    const flashText = new FlashText();
    flashText.addKeyword('telegram');

    const keywordDict: KeywordTrieDictionary = flashText.trie;
    const currentDict = getNodeByPath(keywordDict, ['t', 'e', 'l', 'e', 'g']);

    const [closestNode, cost, depth] = flashText
      .levensthein('am', 1, currentDict, [new Map(), 0, 0])
      .next().value;

    expect(closestNode).toEqual(getNodeByPath(currentDict, ['r', 'a', 'm']));
    expect(cost).toEqual(1);
    expect(depth).toEqual(3);
  });

  it('[substitutions] should end up on the right node in the trie when starting from the current node', () => {
    const flashText = new FlashText();
    flashText.addKeyword('skype', 'messenger');

    const keywordDict: KeywordTrieDictionary = flashText.trie;
    const currentDict = getNodeByPath(keywordDict, ['s', 'k']);

    const [closestNode, cost, depth] = flashText
      .levensthein('ope', 1, currentDict, [new Map(), 0, 0])
      .next().value;

    expect(closestNode).toEqual(getNodeByPath(currentDict, ['y', 'p', 'e']));
    expect(cost).toEqual(1);
    expect(depth).toEqual(3);
  });

  it('should extract keyword made of multiple words and with a cost', () => {
    /**
     * Here we try to extract a keyword made of different words
     * the current cost should be decreased by one when encountering 'maade' (1 insertion)
     * and again by one when encountering 'multple' (1 deletion)
     */

    const flashText = new FlashText();
    const keyword = 'made of multiple words';
    flashText.addKeyword(keyword);

    const sentence = 'this sentence contains a keyword maade of multple words';
    const expectedResult = [[keyword, 33, 55]];

    const keywordsExtracted = flashText.extractKeywords(sentence, true, 2);
    expect(keywordsExtracted).toEqual(expectedResult);
  });

  it('should extract multiple keywords with multiple words and with a cost', () => {
    const flashText = new FlashText();
    flashText.addKeyword('first keyword');
    flashText.addKeyword('second keyword');

    const sentence = 'starts with a first kyword then add a secand keyword';
    const expectedResult = [
      ['first keyword', 14, 26],
      ['second keyword', 38, 52],
    ];

    const keywordsExtracted = flashText.extractKeywords(sentence, true, 1);
    expect(keywordsExtracted).toEqual(expectedResult);
  });

  it('should extract different keywords depending on the cost allowed', () => {
    /**
     * In this test, we have an intermediate fuzzy match with a keyword (the shortest one)
     * We first check that we extract the longest keyword if the max_cost is big enough
     * Then we retry with a smaller max_cost, excluding the longest, and check that the shortest is extracted
     */

    const flashText = new FlashText();
    flashText.addKeyword('keyword');
    flashText.addKeyword('keyword with many words');

    const sentence = 'This sentence contains a keywrd with many woords';

    const shortestKeywordResult = [['keyword', 25, 31]];
    const longestKeywordResult = [['keyword with many words', 25, 48]];

    const shortestKeywordsExtracted = flashText.extractKeywords(
      sentence,
      true,
      1
    );
    const longestKeywordsExtracted = flashText.extractKeywords(
      sentence,
      true,
      2
    );

    expect(shortestKeywordsExtracted).toEqual(shortestKeywordResult);
    expect(longestKeywordsExtracted).toEqual(longestKeywordResult);
  });

  it('should extract short keyword when cost is too expensive', () => {
    /**
     * In this test, we have an intermediate fuzzy match with a keyword (the shortest one)
     * We check that we get only the shortest keyword when going further into fuzzy match is too
     * expansive to get the longest keyword. We also extract a classic match later in the string,
     * to check that the inner data structures all have a correct state
     */

    const flashText = new FlashText();
    flashText.addKeyword('keyword');
    flashText.addKeyword('keyword with many words');

    const sentence =
      'This sentence contains a keywrd with many items inside, a keyword at the end';

    const expectedResult = [
      ['keyword', 25, 31],
      ['keyword', 58, 65],
    ];

    const keywordsExtracted = flashText.extractKeywords(sentence, true, 2);
    expect(keywordsExtracted).toEqual(expectedResult);
  });
});
