import PWABadge from "./PWABadge.tsx";
import "./App.css";

const DONE = "Done";

function App() {
  const readFiles = async (
    dirHandle: FileSystemDirectoryHandle,
    moveHandle: FileSystemDirectoryHandle,
    rootHandle: FileSystemDirectoryHandle
  ) => {
    // @ts-expect-error: aads
    for await (const handle of dirHandle.values()) {
      if (handle.kind === "file") {
        const fileHandle = handle as FileSystemFileHandle;
        // @ts-expect-error: aads
        await fileHandle.move(moveHandle);
      } else if (handle.kind === "directory") {
        if (handle.name === DONE) {
          continue;
        }
        const subDirHandle = handle as FileSystemDirectoryHandle;
        const subDirMoveHandle = await moveHandle.getDirectoryHandle(
          handle.name,
          {
            create: true,
          }
        );
        await readFiles(subDirHandle, subDirMoveHandle, rootHandle);
      }
    }
  };

  const handleButtonPress = async () => {
    // @ts-expect-error: aads
    const root = await self.showDirectoryPicker();
    const moveHandle = await root.getDirectoryHandle(DONE, {
      create: true,
    });
    await readFiles(root, moveHandle, root);
  };

  return (
    <>
      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={appLogo} className="logo" alt="pwa logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div> */}
      <h1>File System Access Demo</h1>
      <div className="card">
        <button onClick={handleButtonPress}>Move</button>
      </div>
      <PWABadge />
    </>
  );
}

export default App;
