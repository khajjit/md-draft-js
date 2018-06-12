import classNames from 'classnames';
import React from 'react';
import commands from './commands';
import { Editor, EditorState, RichUtils } from '../src';
import { isApplied } from '../src/rich';

const content = '# Sample title\n\nYour content goes here.';

export default class MyEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = { editorState: EditorState.createWithContent(content) };
    this.onChange = (editorState) => this.setState({ editorState });
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }

  handleKeyCommand({ key }) {
    const newState = RichUtils.applyCommand(this.state.editorState, key);

    if (newState) {
      this.onChange(newState);
    }
  }

  onClickCommand(command, metadata) {
    this.onChange(RichUtils.applyCommand(this.state.editorState, command, metadata));
  }

  onLinkClick() {
    const link = global.prompt('Link URL:');

    if (link) {
      this.onChange(RichUtils.applyCommand(this.state.editorState, 'link', link));
    }
  }

  onImageClick() {
    const image = global.prompt('Image URL:');

    if (image) {
      this.onChange(RichUtils.applyCommand(this.state.editorState, 'media', image));
    }
  }

  render() {
    return (
      <div className="editor">
        <div className="editor-buttons">
          {commands.map(({ command, metadata, label, icon }, key) => (
            <button
              key={key}
              className={classNames('editor-action', isApplied(this.state.editorState, command) ? 'active' : '')}
              onClick={this.onClickCommand.bind(this, command, metadata)}
              aria-label="Bold"
            >
              <span
                key={`span-${key}`}
                aria-hidden="true"
              >{label}
              </span>
            </button>
          ))}
          <button
            className="editor-action"
            onClick={this.onLinkClick.bind(this)}
            aria-label="Link"
          >
            <span
              className="glyphicon glyphicon-link"
              aria-hidden="true"
            />
          </button>
          <button
            className="editor-action"
            onClick={this.onImageClick.bind(this)}
            aria-label="Image"
          >
            <span
              className="glyphicon glyphicon-picture"
              aria-hidden="true"
            />
          </button>
        </div>
        <Editor
          autoFocus
          className="editor-textarea"
          editorState={this.state.editorState}
          onKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
