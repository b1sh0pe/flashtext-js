import { FlashText } from '../src/flashtext';

describe('Get All Keywords', () => {
  it('should return all keywords (case insensitive)', () => {
    const flashText = new FlashText();

    flashText.addKeyword('JS', 'Javascript');
    flashText.addKeyword('TS', 'Typescript');

    const result = flashText.getAllKeywords();
    expect(result).toEqual({
      js: 'Javascript',
      ts: 'Typescript',
    });

    expect(flashText.length).toBe(2);
  });

  it('should return all keywords (case sensitive)', () => {
    const flashText = new FlashText(true);

    flashText.addKeyword('JS', 'Javascript');
    flashText.addKeyword('TS', 'Typescript');

    const result = flashText.getAllKeywords();
    expect(result).toEqual({
      JS: 'Javascript',
      TS: 'Typescript',
    });

    expect(flashText.length).toBe(2);
  });
});
