import React, { Component } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { MonacoEditorProps } from './types';

export class Editor extends Component {
  public containerElement: React.RefObject<HTMLDivElement | null>;
  public editor: React.RefObject<monaco.editor.IStandaloneCodeEditor | null>;

  private _subscription: React.RefObject<monaco.IDisposable | null>;
  private __prevent_trigger_change_event: React.RefObject<boolean | null>;

  constructor(props: MonacoEditorProps) {
    super(props);
    this.state = {};
    this.containerElement = React.createRef();
    this.editor = React.createRef();
    this._subscription = React.createRef();
    this.__prevent_trigger_change_event = React.createRef();
  }

  render() {
    return <div>Editor</div>;
  }
}

export default Editor;
