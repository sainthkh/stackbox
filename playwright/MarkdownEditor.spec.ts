// @ts-nocheck
import { setupEach, describe, test, expect } from './util'

describe('MarkdownEditor', () => {
  setupEach()

  test('edit note title changes the name in the note explorer', async () => {
    // click to open note
    const note = await pwWnd.locator('.note-name')
      .filter({ hasText: 'Test your note skill' })
    await note.click()

    // rename note in the title area
    const noteTitle = await pwWnd.locator('#note-title')
    await noteTitle.fill('New Note Title')

    // click content area to trigger blur
    const noteContent = await pwWnd.locator('#note-content')
    await noteContent.click()

    // check if the note title is updated in the note explorer
    const note2 = await pwWnd.locator('.note-name')
      .filter({ hasText: 'New Note Title' })

    await expect(note2).toBeVisible()
  })
})
