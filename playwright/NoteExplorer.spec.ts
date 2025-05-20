// @ts-nocheck
import { setupEach, describe, test, expect } from './util'

describe('NoteExplorer', () => {
  setupEach()

  test('note is visible correctly', async () => {
    const note = await pwWnd.locator('.note-name')
      .filter({ hasText: 'Welcome to StackBox' })
    await expect(note).toBeVisible()
  })

  test('do not show non-existing note', async () => {
    const nonexistentNote = await pwWnd.getByText('Nonexistent Note')
    await expect(nonexistentNote).not.toBeVisible()
  })

  test('click note name opens note editor', async () => {
    const emptyMsg = await pwWnd.locator('#no-selected')

    await expect(emptyMsg).toHaveText('Select a note or create a new one')

    const note = await pwWnd.locator('.note-name')
      .filter({ hasText: 'Welcome to StackBox' })
    await note.click()

    const noteTitle = await pwWnd.locator('#note-title')

    await expect(noteTitle).toHaveValue('Welcome to StackBox')
  })

  test('clicking folder name toggles folder expansion', async () => {
    const note = await pwWnd.locator('.note-name')
      .filter({ hasText: 'Hello note' })

    await expect(note).not.toBeVisible()

    const folderName = await pwWnd.locator('.folder-name')
      .filter({ hasText: 'Folder A' })
    await folderName.click()

    const note2 = await pwWnd.locator('.note-name')
      .filter({ hasText: 'Hello note' })
    await expect(note2).toBeVisible()
  });

  test('right-clicking folder shows context menu with create new note option', async () => {
    const folderName = await pwWnd.locator('.folder-name')
      .filter({ hasText: 'Folder A' });
    await folderName.click({ button: 'right' });

    const createNewNoteOption = await pwWnd.locator('#add-new-note');
    await expect(createNewNoteOption).toBeVisible();
  });

  test('right-clicking note shows context menu with add new note option', async () => {
    const note = await pwWnd.locator('.note-name')
      .filter({ hasText: 'Welcome to StackBox' });
    await note.click({ button: 'right' });

    const addNewNoteOption = await pwWnd.locator('#add-new-note');
    await expect(addNewNoteOption).toBeVisible();
  });

  test('right-clicking note shows context menu with rename option', async () => {
    const note = await pwWnd.locator('.note-name')
      .filter({ hasText: 'Welcome to StackBox' });
    await note.click({ button: 'right' });

    const renameNoteOption = await pwWnd.locator('#rename-note');
    await expect(renameNoteOption).toBeVisible();
  });

  test('renaming a note updates the note title', async () => {
    const note = await pwWnd.locator('.note-name')
      .filter({ hasText: 'Welcome to StackBox' });
    await note.click({ button: 'right' });

    const renameNoteOption = await pwWnd.locator('#rename-note');
    await renameNoteOption.click();

    const noteTitle = await pwWnd.locator('#editable-file-name');
    await noteTitle.fill('Renamed Note Title');
    await noteTitle.press('Enter');

    const renamedNote = await pwWnd.locator('.note-name')
      .filter({ hasText: 'Renamed Note Title' });

    await expect(renamedNote).toBeVisible();
  });

  test('renaming an active note updates the markdown editor title', async () => {
    const note = await pwWnd.locator('.note-name')
      .filter({ hasText: 'Test your note skill' });
    await note.click();
    await note.click({ button: 'right' });

    const renameNoteOption = await pwWnd.locator('#rename-note');
    await renameNoteOption.click();

    const noteTitle = await pwWnd.locator('#editable-file-name');
    await noteTitle.fill('Renamed Note Title');
    await noteTitle.press('Enter');

    const markdownEditorTitle = await pwWnd.locator('#note-title');
    await expect(markdownEditorTitle).toHaveValue('Renamed Note Title');
  });

  // test('pressing F2 on note opens editor', async () => {
  //   const note = await pwWnd.locator('.note-name')
  //     .filter({ hasText: 'Welcome to StackBox' });
  //   await note.press('F2');

  //   const noteEditor = await pwWnd.locator('#editable-file-name');
  //   await expect(noteEditor).toBeVisible();
  // })

  // test('creating a new note adds an "Untitled" note to the folder', async () => {
  //   const folderName = await pwWnd.locator('.folder-name')
  //     .filter({ hasText: 'Sample Box' });
  //   await folderName.click({ button: 'right' });

  //   const createNewNoteOption = await pwWnd.locator('#create-new-note');
  //   await createNewNoteOption.click();

  //   const newUntitled = await pwWnd.locator('.note-name')
  //     .filter({ hasText: 'Untitled' });

  //   await expect(newUntitled).toBeVisible();
  // });

  // test('creating multiple untitled notes increments the numbering', async () => {
  //   const folderName = await pwWnd.locator('.folder-name')
  //     .filter({ hasText: 'Sample Box' });
  //   await folderName.click({ button: 'right' });
  //   await pwWnd.locator('#create-new-note').click();

  //   // // Add second untitled note
  //   await folderName.click({ button: 'right' });
  //   await pwWnd.locator('#create-new-note').click();

  //   const newUntitled2 = await pwWnd.locator('.note-name')
  //     .filter({ hasText: 'Untitled 2' });

  //   await expect(newUntitled2).toBeVisible();

  //   await folderName.click({ button: 'right' });
  //   await pwWnd.locator('#create-new-note').click();

  //   const newUntitled3 = await pwWnd.locator('.note-name')
  //     .filter({ hasText: 'Untitled 3' });

  //   await expect(newUntitled3).toBeVisible();
  // });
})
