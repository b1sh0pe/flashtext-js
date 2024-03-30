import { FlashText } from '../src/flashtext';

describe('Fuzzy Replace Test Cases', () => {
  it('should replace keywords with a fuzzy match if there is less letters', () => {
    const flashText = new FlashText();
    flashText.addKeyword('Telegram', 'Messenger');

    const sentence = 'Hello, do you have Telegam?';
    const expectedResult = 'Hello, do you have Messenger?';

    const newSentence = flashText.replaceKeywords(sentence, 1);
    expect(newSentence).toEqual(expectedResult);
  });

  it('should replace keywords with a fuzzy match if there is more letters', () => {
    const flashText = new FlashText();
    flashText.addKeyword('colour here', 'couleur ici');
    flashText.addKeyword('and heere', 'et ici');

    const sentence = 'color here blabla and here';
    const expectedResult = 'couleur ici blabla et ici';

    const newSentence = flashText.replaceKeywords(sentence, 1);
    expect(newSentence).toEqual(expectedResult);
  });

  it('should replace keywords when cost is spread across multiple words', () => {
    /**
     * Here we try to replace a keyword made of different words
     * the current cost should be decreased by one when encountering 'maade' (1 insertion)
     * and again by one when encountering 'multple' (1 deletion)
     */
    const flashText = new FlashText();

    flashText.addKeyword('made of multiple words', 'with only one word');
    const sentence = 'this sentence contains a keyword maade of multple words';
    const targetSentence =
      'this sentence contains a keyword with only one word';

    const newSentence = flashText.replaceKeywords(sentence, 2);

    expect(newSentence).toEqual(targetSentence);
  });

  it('should replace multiple keywords', () => {
    const flashText = new FlashText();

    flashText.addKeyword('first keyword', '1st keyword');
    flashText.addKeyword('second keyword', '2nd keyword');
    const sentence = 'start with a first kyword then add a secand keyword';
    const targetSentence = 'start with a 1st keyword then add a 2nd keyword';

    const newSentence = flashText.replaceKeywords(sentence, 1);

    expect(newSentence).toEqual(targetSentence);
  });

  it('should replace keywords when there are intermediate match and no match in the sentence', () => {
    /**
     * In this test, we have an intermediate fuzzy match with a keyword (the shortest one)
     * We check that we get only the shortest keyword when going further into fuzzy match is too
     * expansive to get the longest keyword. We also replace a classic match later in the string,
     * to check that the inner data structures all have a correct state
     */
    const flashText = new FlashText();

    flashText.addKeyword('keyword');
    flashText.addKeyword('keyword with many words');

    const sentence =
      'This sentence contains a keywrd with many items inside, A keyword at the end';
    const targetSentence =
      'This sentence contains a keyword with many items inside, A keyword at the end';

    const newSentence = flashText.replaceKeywords(sentence, 1);

    expect(newSentence).toEqual(targetSentence);
  });

  it('should replace the keywords with special symbols', () => {
    const flashText = new FlashText();

    flashText.addKeyword('No. of Colors', 'Número de colores');

    const sentence = 'No. of colours: 10';
    const targetSentence = 'Número de colores: 10';

    const newSentence = flashText.replaceKeywords(sentence, 2);

    expect(newSentence).toEqual(targetSentence);
  });

  it('should replace the keywords with fuzzy match - sensitive case', () => {
    const flashText = new FlashText(true);

    flashText.addKeyword('No. of Colors', 'Número de colores');

    const sentence = 'No. of colours: 10';
    const targetSentence = 'Número de colores: 10';

    const newSentence = flashText.replaceKeywords(sentence, 2);

    expect(newSentence).toEqual(targetSentence);
  });
});
