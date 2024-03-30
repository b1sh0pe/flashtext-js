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

  it('should return keyword if it is present in trie (case insensitive)', () => {
    const flashText = new FlashText();

    flashText.addKeyword('JS', 'Javascript');
    flashText.addKeyword('TS', 'Typescript');

    expect(flashText.getKeyword('js')).toBe('Javascript');
    expect(flashText.getKeyword('ts')).toBe('Typescript');
  });

  it('should return keyword if it is present in trie (case sensitive)', () => {
    const flashText = new FlashText(true);

    flashText.addKeyword('JS', 'Javascript');
    flashText.addKeyword('TS', 'Typescript');

    expect(flashText.getKeyword('JS')).toBe('Javascript');
    expect(flashText.getKeyword('TS')).toBe('Typescript');
  });

  it('should return undefined if the keyword is not in the trie', () => {
    const flashText = new FlashText();

    flashText.addKeyword('JS', 'Javascript');
    flashText.addKeyword('TS', 'Typescript');

    expect(flashText.getKeyword('JSX')).toBeUndefined();
    expect(flashText.getKeyword('TSX')).toBeUndefined();
  });
});

describe('Contains', () => {
  it('should return true if the keyword is in the trie', () => {
    const flashText = new FlashText();

    flashText.addKeyword('JS', 'Javascript');
    flashText.addKeyword('TS', 'Typescript');

    expect(flashText.contains('JS')).toBe(true);
    expect(flashText.contains('TS')).toBe(true);
  });

  it('should return false if the keyword is not in the trie', () => {
    const flashText = new FlashText();

    flashText.addKeyword('JS', 'Javascript');
    flashText.addKeyword('TS', 'Typescript');

    expect(flashText.contains('JSX')).toBe(false);
    expect(flashText.contains('TSX')).toBe(false);
  });
});

describe('Add Keywords', () => {
  it('should return status as false if the keyword passed is invalid', () => {
    const flashText = new FlashText();

    const result = flashText.addKeyword('');
    expect(result).toBe(false);
  });

  it('should return status as true if the keyword is added successfully', () => {
    const flashText = new FlashText();

    const result = flashText.addKeyword('JS', 'Javascript');
    expect(result).toBe(true);
  });
});
