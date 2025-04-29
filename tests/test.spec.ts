const { test, expect, _electron: electron } = require('@playwright/test')

const describe = test.describe;
const beforeEach = test.beforeEach;
const afterEach = test.afterEach;

describe('test', () => {
    let electronApp: any;
    let window: any;
    beforeEach(async () => {
        electronApp = await electron.launch({ args: ['.'] })
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

    test('root folder is visible', async () => {
        const rootFolder = await window.locator('#notes')
            .filter({ hasText: 'Sample box' })
        await expect(rootFolder).toBeVisible()
    })

    test('click note name opens note editor', async () => {
        const noteTitle = await window.locator('#note-title')

        await expect(noteTitle).not.toHaveText('Welcome to StackBox')

        const note = await window.locator('.note-name')
            .filter({ hasText: 'Welcome to StackBox' })
        await note.click()

        await expect(noteTitle).toHaveValue('Welcome to StackBox')
    })

    test('edit note title changes the name in the file explorer', async () => {
        const noteTitle = await window.locator('#note-title')
        await noteTitle.fill('New Note Title')

        const note = await window.locator('.note-name')
            .filter({ hasText: 'New Note Title' })

        await expect(note).toBeVisible()
    })

    test('clicking folder name toggles folder expansion', async () => {
        const folderName = await window.locator('.folder-name')
            .filter({ hasText: 'Sample Box' })
        await folderName.click()

        const notes = await window.locator('.note-name')
            .filter({ hasText: 'Welcome to StackBox' })
        await expect(notes).not.toBeVisible()
    });
})
