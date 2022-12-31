import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useEffect, useMemo, useRef } from 'react';
import { MonacoEditorProps } from './types';
import { processSize, noop } from './utils';

function Editor({
  width,
  height,
  value,
  defaultValue,
  language,
  theme,
  options,
  overrideServices,
  editorWillMount,
  editorDidMount,
  editorWillUnmount,
  onChange,
  className
}: MonacoEditorProps) {
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

  const handleEditorWillMount = () => {
    const finalOptions = editorWillMount(monaco);
    return finalOptions || {};
  };

  const handleEditorDidMount = () => {
    if (editor.current) {
      editorDidMount(editor.current, monaco);

      _subscription.current = editor.current.onDidChangeModelContent(
        (event) => {
          if (!__prevent_trigger_change_event.current) {
            onChange(editor.current!.getValue(), event);
          }
        }
      );
    }
  };

  const handleEditorWillUnmount = () => {
    editorWillUnmount(editor.current!, monaco);
  };

  const initMonaco = () => {
    const finalValue = value !== null ? value : defaultValue;
    if (containerElement.current) {
      // Before initializing monaco editor
      const finalOptions = { ...options, ...handleEditorWillMount() };
      editor.current = monaco.editor.create(
        containerElement.current,
        {
          value: finalValue,
          language,
          ...(className ? { extraEditorClassName: className } : {}),
          ...finalOptions,
          ...(theme ? { theme } : {})
        },
        overrideServices
      );
      // After initializing monaco editor
      handleEditorDidMount();
    }
  };

  useEffect(initMonaco, []);

  useEffect(() => {
    if (editor.current) {
      const model = editor.current.getModel();
      __prevent_trigger_change_event.current = true;
      editor.current.pushUndoStop();
      // pushEditOperations says it expects a cursorComputer, but doesn't seem to need one.
      model!.pushEditOperations(
        [],
        [
          {
            range: model!.getFullModelRange(),
            text: value
          }
        ],
        () => null
      );
      editor.current.pushUndoStop();
      __prevent_trigger_change_event.current = false;
    }
  }, [value]);

  useEffect(() => {
    if (editor.current) {
      const model = editor.current.getModel();
      monaco.editor.setModelLanguage(model!, language);
    }
  }, [language]);

  useEffect(() => {
    if (editor.current) {
      // Don't pass in the model on update because monaco crashes if we pass the model
      // a second time. See https://github.com/microsoft/monaco-editor/issues/2027
      const { model: _model, ...optionsWithoutModel } = options;
      editor.current.updateOptions({
        ...(className ? { extraEditorClassName: className } : {}),
        ...optionsWithoutModel
      });
    }
  }, [className, options]);

  useEffect(() => {
    if (editor.current) {
      editor.current.layout();
    }
  }, [width, height]);

  useEffect(() => {
    monaco.editor.setTheme(theme!);
  }, [theme]);

  useEffect(
    () => () => {
      if (editor.current) {
        handleEditorWillUnmount();
        editor.current.dispose();
        const model = editor.current.getModel();
        if (model) {
          model.dispose();
        }
      }
      if (_subscription.current) {
        _subscription.current.dispose();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div
      ref={containerElement}
      style={style}
      className="react-monaco-editor-container"
    />
  );
}

Editor.defaultProps = {
  width: "100vh",
  height: "100vh",
  value: null,
  defaultValue: "",
  language: "lua",
  theme: null,
  options: {},
  overrideServices: {},
  editorWillMount: noop,
  editorDidMount: noop,
  editorWillUnmount: noop,
  onChange: noop,
  className: null,
};

export default Editor;
