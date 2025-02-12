import * as assert from 'assert';
import { Position, window } from 'vscode';
import {
  getCurrentParagraphBeginning,
  getCurrentParagraphEnd,
} from '../../src/textobject/paragraph';
import { WordType } from '../../src/textobject/word';
import { TextEditor } from '../../src/textEditor';
import { assertEqualLines, cleanUpWorkspace, setupWorkspace } from '../testUtils';
import { ModeHandler } from '../../src/mode/modeHandler';
import { getAndUpdateModeHandler } from '../../extension';
import * as vscode from 'vscode';
import { Configuration } from '../testConfiguration';

suite('insertLineBefore', () => {
  let modeHandler: ModeHandler;

  suiteSetup(async () => {
    const configuration = new Configuration();
    configuration.tabstop = 4;
    configuration.expandtab = true;

    await setupWorkspace(configuration);
    await setupWorkspace();
    modeHandler = (await getAndUpdateModeHandler())!;
  });

  suiteTeardown(cleanUpWorkspace);

  test('tabs are added to match previous line even if line above does not match', async () => {
    // Setup the test
    await modeHandler.handleMultipleKeyEvents(['<Esc>', 'g', 'g', 'd', 'G']);
    await modeHandler.handleMultipleKeyEvents('i\na'.split(''));
    await modeHandler.handleMultipleKeyEvents(['<Esc>']);
    await modeHandler.handleMultipleKeyEvents('2G>>ob\nc'.split(''));

    // This is the current state of the document
    //
    //    a
    //    b
    //    c
    await modeHandler.handleMultipleKeyEvents(['<Esc>', '2', 'G', 'L', 'a']);
    const text = vscode.window.activeTextEditor?.document.getText().split('\n');
    assert.ok(text);
    assert.strictEqual(text[1].replace(/[\n\r]/g, ''), text[2].replace(/[\n\r]/g, ''));
  });

  test('no extra whitespace added when insertLineBefore inserts correct amount', async () => {
    await modeHandler.handleMultipleKeyEvents(['<Esc>', 'g', 'g', 'd', 'G']);
    await modeHandler.handleMultipleKeyEvents('i\na'.split(''));
    await modeHandler.handleMultipleKeyEvents(['<Esc>']);
    await modeHandler.handleMultipleKeyEvents('2G>>ob\nc'.split(''));

    // This is the current state of the document
    //
    //    a
    //    b
    //    c
    await modeHandler.handleMultipleKeyEvents(['<Esc>', '3', 'G', 'L', 'b']);
    const text = vscode.window.activeTextEditor?.document.getText().split('\n');
    assert.ok(text);
    assert.strictEqual(text[2].replace(/[\n\r]/g, ''), text[3].replace(/[\n\r]/g, ''));
  });

  test('no extra whitespace left when insertLineBefore inserts more than correct amount', async () => {
    await modeHandler.handleMultipleKeyEvents(['<Esc>', 'g', 'g', 'd', 'G']);
    await modeHandler.handleMultipleKeyEvents('i\na'.split(''));
    await modeHandler.handleMultipleKeyEvents(['<Esc>']);
    await modeHandler.handleMultipleKeyEvents('2G>>ob\nc'.split(''));
    await modeHandler.handleMultipleKeyEvents(['<Esc>']);
    await modeHandler.handleMultipleKeyEvents('3G>>'.split(''));

    // This is the current state of the document
    //
    //    a
    //        b
    //    c
    await modeHandler.handleMultipleKeyEvents(['<Esc>', '4', 'G', '2', 'L', 'c']);
    const text = vscode.window.activeTextEditor?.document.getText().split('\n');
    //
    //    a
    //        b
    //    c
    //    c
    //    c
    assert.ok(text);
    assert.strictEqual(text[3].replace(/[\n\r]/g, ''), text[4].replace(/[\n\r]/g, ''));
    assert.strictEqual(text[4].replace(/[\n\r]/g, ''), text[5].replace(/[\n\r]/g, ''));
  });

  test('works at the top of the document', async () => {
    await modeHandler.handleMultipleKeyEvents(['<Esc>', 'g', 'g', 'd', 'G']);
    await modeHandler.handleMultipleKeyEvents('ia'.split(''));
    await modeHandler.handleMultipleKeyEvents(['<Esc>']);
    await modeHandler.handleMultipleKeyEvents('gg>>'.split(''));

    // This is the current state of the document
    //    a
    await modeHandler.handleMultipleKeyEvents(['<Esc>', 'g', 'g', 'L', 'a']);
    const text = vscode.window.activeTextEditor?.document.getText().split('\n');
    assert.ok(text);
    assert.strictEqual(text[0].replace(/[\n\r]/g, ''), text[1].replace(/[\n\r]/g, ''));
  });

  test('works with multiple cursors', async () => {
    await modeHandler.handleMultipleKeyEvents(['<Esc>', 'g', 'g', 'd', 'G']);
    await modeHandler.handleMultipleKeyEvents('oa'.split(''));
    await modeHandler.handleMultipleKeyEvents(['<Esc>']);
    await modeHandler.handleMultipleKeyEvents('2G>>'.split(''));
    // This is the current state of the document
    //
    //    a
    await modeHandler.handleMultipleKeyEvents(['<Esc>', '2', 'G', '2', 'L', 'a']);
    // After
    //
    //    a
    //    a
    //    a
    const text = vscode.window.activeTextEditor?.document.getText().split('\n');
    assert.ok(text);
    assert.strictEqual(text[1].replace(/[\n\r]/g, ''), text[2].replace(/[\n\r]/g, ''));
    assert.strictEqual(text[2].replace(/[\n\r]/g, ''), text[3].replace(/[\n\r]/g, ''));
  });
});
