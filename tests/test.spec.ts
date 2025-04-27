const { test, expect, _electron: electron } = require('@playwright/test')

test('note is visible correctly', async () => {
    const electronApp = await electron.launch({ args: ['.'] })
    const isPackaged = await electronApp.evaluate(async ({ app }) => {
        // This runs in Electron's main process, parameter here is always
        // the result of the require('electron') in the main app script.
        return app.isPackaged
    })

    expect(isPackaged).toBe(false)

    // Wait for the first BrowserWindow to open
    // and return its Page object
    const window = await electronApp.firstWindow()
    await window.screenshot({ path: 'intro.png' })

    const note = await window.locator('#notes')
        .filter({ hasText: 'Welcome to Notes' })
    await expect(note).toBeVisible()

    const nonexistentNote = await window.getByText('Nonexistent Note')
    // expect(nonexistentNote).not.toBeVisible()
    await expect(nonexistentNote).not.toBeVisible()

    // close app
    await electronApp.close()
})