import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useEffect, useMemo, useRef } from 'react';
import { processSize, noop } from './utils';

function Editor(height: number, width: number) {
  const containerElement = useRef<HTMLDivElement | null>(null);
  const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const _subscription = useRef<monaco.IDisposable | null>(null);
  const __prevent_trigger_change_event = useRef<boolean | null>(null);

  const fixedHeight = processSize(height);
  const fixedWidth = processSize(width);

  const style = useMemo(
    () => ({
      height: fixedHeight,
      width: fixedWidth
    }),
    [fixedHeight, fixedWidth]
  );

  useEffect(() => {
    if (editor.current) {
      editor.current.layout();
    }
  }, [width, height]);

  return (
    <div
      ref={containerElement}
      style={style}
      className="react-monaco-editor-container"
    />
  );
}

export default Editor;
