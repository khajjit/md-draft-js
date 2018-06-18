import React from 'react';

import { applyCommand, isApplied } from '../rich';
import { getChunks, getOwnChunks } from '../chunks';
import { handleKey } from '../utils/handleKey';
import { commands } from '../utils/constants';
import { setSelection } from '../utils/selection';
import { getText } from '../state';

export default class Editor extends React.Component {
  static defaultProps = {
    content: '',
    name: 'content',
    onChange: () => {},
    onKeyCommand: () => {},
    commands
  };

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const props = [
      'before',
      'after',
      'startTag',
      'endTag',
      'selection'
    ];

    return nextProps.className !== this.props.className ||
      props.some(prop => nextProps.editorState[prop] !== this.props[prop]);
  }

  componentDidUpdate() {
    setSelection(this.props.editorState, this.textarea);
  }

  handleKeyDown(e) {
    if (e.which === 13) { // enter
      if (isApplied(this.props.editorState, 'ul')) {
        e.preventDefault();
        this.handleChange(null, applyCommand(this.props.editorState, 'ul'))
      }
      if (isApplied(this.props.editorState, 'ol')) {
        e.preventDefault();
        this.handleChange(null, applyCommand(this.props.editorState, 'ol'))
      }
    }
    this.props.commands.forEach((command) => {
      if (command.combo && handleKey(e, command.combo)) {
        e.preventDefault();
        this.props.onKeyCommand(command);
      }
    });
  }

  handleChange(e, _ownData) {
    const { onChange } = this.props;
    const chunks = _ownData ? getOwnChunks(_ownData) : getChunks(e.target);
    onChange(chunks);
  }

  render() {
    const {
      autoFocus,
      name,
      editorState
    } = this.props;
    const text = getText(editorState);

    return (
      <textarea
        autoFocus={autoFocus}
        ref={(c) => { this.textarea = c; }}
        id={name}
        name={name}
        value={text}
        className={this.props.className}
        onKeyDown={this.handleKeyDown}
        onChange={this.handleChange}
        onSelect={this.handleChange}
      />
    );
  }
}
