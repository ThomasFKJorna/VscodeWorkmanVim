import {
  buildTriggerKeys,
  EasymotionTrigger,
} from '../../src/actions/plugins/easymotion/easymotion.cmd';
import { Configuration } from '../testConfiguration';
import { newTest } from '../testSimplifier';
import { cleanUpWorkspace, setupWorkspace } from './../testUtils';

function easymotionCommand(trigger: EasymotionTrigger, searchWord: string, jumpKey: string) {
  return [...buildTriggerKeys(trigger), searchWord, jumpKey].join('');
}

suite('easymotion plugin', () => {
  setup(async () => {
    const configuration = new Configuration();
    configuration.easymotion = true;

    await setupWorkspace(configuration);
  });

  teardown(cleanUpWorkspace);

  newTest({
    title: 'Can handle s move',
    start: ['a|bcdabcd'],
    keysPressed: easymotionCommand({ key: 's' }, 'a', 'e'),
    end: ['|abcdabcd'],
  });

  newTest({
    title: 'Can handle 2s move',
    start: ['ab|cdabcd'],
    keysPressed: easymotionCommand({ key: '2s' }, 'ab', 'e'),
    end: ['|abcdabcd'],
  });

  newTest({
    title: 'Can handle f move',
    start: ['a|bcdabcdabcd'],
    keysPressed: easymotionCommand({ key: 'f' }, 'a', 'e'),
    end: ['abcdabcd|abcd'],
  });

  newTest({
    title: 'Can handle 2f move',
    start: ['a|bcdabcdabcd'],
    keysPressed: easymotionCommand({ key: '2f' }, 'ab', 'e'),
    end: ['abcdabcd|abcd'],
  });

  newTest({
    title: 'Can handle F move',
    start: ['abcdabc|dabcd'],
    keysPressed: easymotionCommand({ key: 'F' }, 'a', 'e'),
    end: ['|abcdabcdabcd'],
  });

  newTest({
    title: 'Can handle 2F move',
    start: ['abcdabc|dabcd'],
    keysPressed: easymotionCommand({ key: '2F' }, 'ab', 'e'),
    end: ['|abcdabcdabcd'],
  });

  newTest({
    title: 'Can handle t move',
    start: ['abcd|abcdabcd'],
    keysPressed: easymotionCommand({ key: 't' }, 'c', 'e'),
    end: ['abcdabcda|bcd'],
  });

  newTest({
    title: 'Can handle bd-t move',
    start: ['abcd|abcdabcd'],
    keysPressed: easymotionCommand({ key: 'bdt', leaderCount: 3 }, 'c', 'e'),
    end: ['a|bcdabcdabcd'],
  });

  newTest({
    title: 'Can handle 2t move',
    start: ['abcd|abcdabcd'],
    keysPressed: easymotionCommand({ key: '2t' }, 'cd', 'e'),
    end: ['abcdabcda|bcd'],
  });

  newTest({
    title: 'Can handle bd-t2 move',
    start: ['abcd|abcdabcd'],
    keysPressed: easymotionCommand({ key: 'bd2t', leaderCount: 3 }, 'cd', 'e'),
    end: ['a|bcdabcdabcd'],
  });

  newTest({
    title: 'Can handle T move',
    start: ['abcdab|cdabcd'],
    keysPressed: easymotionCommand({ key: 'T' }, 'a', 'e'),
    end: ['a|bcdabcdabcd'],
  });

  newTest({
    title: 'Can handle 2T move',
    start: ['abcdabc|dabcd'],
    keysPressed: easymotionCommand({ key: '2T' }, 'ab', 'e'),
    end: ['ab|cdabcdabcd'],
  });

  newTest({
    title: 'Can handle w move',
    start: ['abc |def ghi jkl'],
    keysPressed: easymotionCommand({ key: 'w' }, '', 'e'),
    end: ['abc def ghi |jkl'],
  });

  newTest({
    title: 'Can handle bd-w move',
    start: ['abc |def ghi jkl'],
    keysPressed: easymotionCommand({ key: 'bdw', leaderCount: 3 }, '', 'e'),
    end: ['|abc def ghi jkl'],
  });

  newTest({
    title: 'Can handle b move',
    start: ['abc def |ghi jkl'],
    keysPressed: easymotionCommand({ key: 'b' }, '', 'e'),
    end: ['|abc def ghi jkl'],
  });

  newTest({
    title: 'Can handle e move',
    start: ['abc |def ghi jkl'],
    keysPressed: easymotionCommand({ key: 'e' }, '', 'e'),
    end: ['abc def ghi jk|l'],
  });

  newTest({
    title: 'Can handle bd-e move',
    start: ['abc |def ghi jkl'],
    keysPressed: easymotionCommand({ key: 'bde', leaderCount: 3 }, '', 'e'),
    end: ['ab|c def ghi jkl'],
  });

  newTest({
    title: 'Can handle ge move',
    start: ['abc def |ghi jkl'],
    keysPressed: easymotionCommand({ key: 'ge' }, '', 'e'),
    end: ['ab|c def ghi jkl'],
  });

  newTest({
    title: 'Can handle n-char move',
    start: ['abc |def ghi jkl', 'abc def ghi jkl'],
    keysPressed: easymotionCommand({ key: '/' }, 'ghi\n', 'e'),
    end: ['abc def ghi jkl', 'abc def |ghi jkl'],
  });

  newTest({
    title: 'Can handle j move',
    start: ['abc', 'd|ef', 'ghi', 'jkl'],
    keysPressed: easymotionCommand({ key: 'n' }, '', 'e'),
    end: ['abc', 'def', 'ghi', '|jkl'],
  });

  newTest({
    title: 'Can handle k move',
    start: ['abc', 'def', 'g|hi', 'jkl'],
    keysPressed: easymotionCommand({ key: 'e' }, '', 'e'),
    end: ['abc', '|def', 'ghi', 'jkl'],
  });

  newTest({
    title: 'Can handle bd-jk move (1)',
    start: ['abc', 'def', '|ghi', 'jkl'],
    keysPressed: easymotionCommand({ key: 'bdjk', leaderCount: 3 }, '', 'e'),
    end: ['abc', '|def', 'ghi', 'jkl'],
  });

  newTest({
    title: 'Can handle bd-jk move (2)',
    start: ['abc', 'def', '|ghi', 'jkl'],
    keysPressed: easymotionCommand({ key: 'bdjk', leaderCount: 3 }, '', 'y'),
    end: ['abc', 'def', 'ghi', '|jkl'],
  });

  newTest({
    title: 'Can handle lineforward move (1)',
    start: ['|abcDefGhi'],
    keysPressed: easymotionCommand({ key: 'o', leaderCount: 2 }, '', 'y'),
    end: ['abc|DefGhi'],
  });

  newTest({
    title: 'Can handle lineforward move (2)',
    start: ['|abcDefGhi'],
    keysPressed: easymotionCommand({ key: 'o', leaderCount: 2 }, '', 'e'),
    end: ['abcDef|Ghi'],
  });

  newTest({
    title: 'Can handle linebackward move (1)',
    start: ['abcDefGh|i'],
    keysPressed: easymotionCommand({ key: 'y', leaderCount: 2 }, '', 'e'),
    end: ['abc|DefGhi'],
  });

  newTest({
    title: 'Can handle linebackward move (2)',
    start: ['abcDefGh|i'],
    keysPressed: easymotionCommand({ key: 'y', leaderCount: 2 }, '', 'y'),
    end: ['abcDef|Ghi'],
  });

  newTest({
    title: 'Can handle searching for backslash (\\)',
    start: ['|https:\\\\www.google.com'],
    keysPressed: easymotionCommand({ key: 'f' }, '\\', 'e'),
    end: ['https:\\|\\www.google.com'],
  });

  newTest({
    title: 'Can handle searching for carat (^)',
    start: ['|<^_^>'],
    keysPressed: easymotionCommand({ key: 'f' }, '^', 'y'),
    end: ['<|^_^>'],
  });

  newTest({
    title: 'Can handle searching for dot (.)',
    start: ['|https:\\\\www.google.com'],
    keysPressed: easymotionCommand({ key: 'f' }, '.', 'e'),
    end: ['https:\\\\www.google|.com'],
  });
});
