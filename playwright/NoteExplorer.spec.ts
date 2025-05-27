// @ts-nocheck
import { setupEach, describe, test, expect } from './util'

describe('NoteExplorer', () => {
  setupEach()

  describe('note', () => {
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
  })

  describe('note context menu and shortcuts', () => {
    describe('add new note', () => {
      test('right-clicking note shows context menu with add new note option', async () => {
        const note = await pwWnd.locator('.note-name')
          .filter({ hasText: 'Welcome to StackBox' });
        await note.click({ button: 'right' });

        const addNewNoteOption = await pwWnd.locator('#add-new-note');
        await expect(addNewNoteOption).toBeVisible();
      });

      test('add new note correctly', async () => {
        const note = await pwWnd.locator('.note-name')
          .filter({ hasText: 'Welcome to StackBox' });
        await note.click({ button: 'right' });

        const addNewNoteOption = await pwWnd.locator('#add-new-note');
        await addNewNoteOption.click();

        const noteTitle = await pwWnd.locator('#editable-file-name');
        await noteTitle.fill('New Note Title');
        await noteTitle.press('Enter');

        const newNote = await pwWnd.locator('.note-name')
          .filter({ hasText: 'New Note Title' });
        await expect(newNote).toBeVisible();
      })

      test('add new note with id', async () => {
        const folder = await pwWnd.locator('.folder-name')
          .filter({ hasText: 'P20. Project X' });
        await folder.click();

        const folder2 = await pwWnd.locator('.folder-name')
          .filter({ hasText: 'stack' });
        await folder2.click();

        const note = await pwWnd.locator('.note-name')
          .filter({ hasText: 'P20.S.1 What is X' });
        await note.click({ button: 'right' });

        const addNewNoteOption = await pwWnd.locator('#add-new-note');
        await addNewNoteOption.click();

        const noteTitle = await pwWnd.locator('#editable-file-name');
        await expect(noteTitle).toHaveValue('P20.S.1');
      })
    })

    describe('rename note', () => {
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

      test('when NoteExplorer has focus, pressing F2 opens rename editor', async () => {
        const note = await pwWnd.locator('.note-name')
          .filter({ hasText: 'Test your note skill' });
        await note.click();
        await note.press('F2');

        const noteTitle = await pwWnd.locator('#editable-file-name');
        await expect(noteTitle).toBeVisible();
        await expect(noteTitle).toHaveValue('Test your note skill');
      });
    })
  })

  describe('folder', () => {
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
  })

  describe('folder context menu', () => {
    test('right-clicking folder shows context menu with add new note option', async () => {
      const folderName = await pwWnd.locator('.folder-name')
        .filter({ hasText: 'Folder A' });
      await folderName.click({ button: 'right' });

      const createNewNoteOption = await pwWnd.locator('#add-new-note');
      await expect(createNewNoteOption).toBeVisible();
    });
  })

  // test('pressing F2 on note opens editor', async () => {
  //   const note = await pwWnd.locator('.note-name')
  //     .filter({ hasText: 'Welcome to StackBox' });
  //   await note.press('F2');

  //   const noteEditor = await pwWnd.locator('#editable-file-name');
  //   await expect(noteEditor).toBeVisible();
  // })
})
