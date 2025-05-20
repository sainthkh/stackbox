const { test, expect, _electron: electron } = require('@playwright/test')

export const describe = test.describe;
export const beforeEach = test.beforeEach;
export const afterEach = test.afterEach;

export { test, expect }

export const setupEach = async () => {
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
    global.pwWnd = window
  });

  afterEach(async () => {
    await electronApp.close()
  });
}
