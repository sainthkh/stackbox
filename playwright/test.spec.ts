// @ts-nocheck
const { test, expect, _electron: electron } = require('@playwright/test')

const describe = test.describe;
const beforeEach = test.beforeEach;
const afterEach = test.afterEach;

describe('test', () => {
  let electronApp: any;
  let window: any;
  beforeEach(async () => {
    electronApp = await electron.launch({ args: ['.', '--test-no-write'] })
    const isPackaged = await electronApp.evaluate(async ({ app }) => {
      // This runs in Electron's main process, parameter here is always
      // the result of the require('electron') in the main app script.
      return app.isPackaged
    })

    expect(isPackaged).toBe(false)

    // Wait for the first BrowserWindow to open
    // and return its Page object
    window = await electronApp.firstWindow()
  });

  afterEach(async () => {
    await electronApp.close()
  });

  test('note is visible correctly', async () => {
    const note = await window.locator('.note-name')
      .filter({ hasText: 'Welcome to StackBox' })
    await expect(note).toBeVisible()
  })

  test('do not show non-existing note', async () => {
    const nonexistentNote = await window.getByText('Nonexistent Note')
    await expect(nonexistentNote).not.toBeVisible()
  })

  test('click note name opens note editor', async () => {
    const emptyMsg = await window.locator('#no-selected')

    await expect(emptyMsg).toHaveText('Select a note or create a new one')

    const note = await window.locator('.note-name')
      .filter({ hasText: 'Welcome to StackBox' })
    await note.click()

    const noteTitle = await window.locator('#note-title')

    await expect(noteTitle).toHaveValue('Welcome to StackBox')
  })

  test('clicking folder name toggles folder expansion', async () => {
    const note = await window.locator('.note-name')
      .filter({ hasText: 'Hello note' })

    await expect(note).not.toBeVisible()

    const folderName = await window.locator('.folder-name')
      .filter({ hasText: 'Folder A' })
    await folderName.click()

    const note2 = await window.locator('.note-name')
      .filter({ hasText: 'Hello note' })
    await expect(note2).toBeVisible()
  });

  test('right-clicking folder shows context menu with create new note option', async () => {
    const folderName = await window.locator('.folder-name')
      .filter({ hasText: 'Folder A' });
    await folderName.click({ button: 'right' });

    const createNewNoteOption = await window.locator('#add-new-note');
    await expect(createNewNoteOption).toBeVisible();
  });

  test('right-clicking note shows context menu with add new note option', async () => {
    const note = await window.locator('.note-name')
      .filter({ hasText: 'Welcome to StackBox' });
    await note.click({ button: 'right' });

    const addNewNoteOption = await window.locator('#add-new-note');
    await expect(addNewNoteOption).toBeVisible();
  });

  test('right-clicking note shows context menu with rename option', async () => {
    const note = await window.locator('.note-name')
      .filter({ hasText: 'Welcome to StackBox' });
    await note.click({ button: 'right' });

    const renameNoteOption = await window.locator('#rename-note');
    await expect(renameNoteOption).toBeVisible();
  });

  test('renaming a note updates the note title', async () => {
    const note = await window.locator('.note-name')
      .filter({ hasText: 'Welcome to StackBox' });
    await note.click({ button: 'right' });

    const renameNoteOption = await window.locator('#rename-note');
    await renameNoteOption.click();

    const noteTitle = await window.locator('#editable-file-name');
    await noteTitle.fill('Renamed Note Title');
    await noteTitle.press('Enter');

    const renamedNote = await window.locator('.note-name')
      .filter({ hasText: 'Renamed Note Title' });

    await expect(renamedNote).toBeVisible();
  });

  // test('edit note title changes the name in the file explorer', async () => {
  //   const noteTitle = await window.locator('#note-title')
  //   await noteTitle.fill('New Note Title')

  //   const note = await window.locator('.note-name')
  //     .filter({ hasText: 'New Note Title' })

  //   await expect(note).toBeVisible()
  // })

  // test('pressing F2 on note opens editor', async () => {
  //   const note = await window.locator('.note-name')
  //     .filter({ hasText: 'Welcome to StackBox' });
  //   await note.press('F2');

  //   const noteEditor = await window.locator('#editable-file-name');
  //   await expect(noteEditor).toBeVisible();
  // })

  // test('creating a new note adds an "Untitled" note to the folder', async () => {
  //   const folderName = await window.locator('.folder-name')
  //     .filter({ hasText: 'Sample Box' });
  //   await folderName.click({ button: 'right' });

  //   const createNewNoteOption = await window.locator('#create-new-note');
  //   await createNewNoteOption.click();

  //   const newUntitled = await window.locator('.note-name')
  //     .filter({ hasText: 'Untitled' });

  //   await expect(newUntitled).toBeVisible();
  // });

  // test('creating multiple untitled notes increments the numbering', async () => {
  //   const folderName = await window.locator('.folder-name')
  //     .filter({ hasText: 'Sample Box' });
  //   await folderName.click({ button: 'right' });
  //   await window.locator('#create-new-note').click();

  //   // // Add second untitled note
  //   await folderName.click({ button: 'right' });
  //   await window.locator('#create-new-note').click();

  //   const newUntitled2 = await window.locator('.note-name')
  //     .filter({ hasText: 'Untitled 2' });

  //   await expect(newUntitled2).toBeVisible();

  //   await folderName.click({ button: 'right' });
  //   await window.locator('#create-new-note').click();

  //   const newUntitled3 = await window.locator('.note-name')
  //     .filter({ hasText: 'Untitled 3' });

  //   await expect(newUntitled3).toBeVisible();
  // });

  // test('renaming an active note updates the markdown editor title', async () => {
  //   const note = await window.locator('.note-name')
  //     .filter({ hasText: 'Test your note skill' });
  //   await note.click();
  //   await note.click({ button: 'right' });

  //   const renameNoteOption = await window.locator('#rename-note');
  //   await renameNoteOption.click();

  //   const noteTitle = await window.locator('#editable-file-name');
  //   await noteTitle.fill('Renamed Note Title');
  //   await noteTitle.press('Enter');

  //   const markdownEditorTitle = await window.locator('#note-title');
  //   await expect(markdownEditorTitle).toHaveValue('Renamed Note Title');
  // });
})
