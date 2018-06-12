import React from 'react';

import { handleKey } from '../utils/handleKey';
import { commands } from '../utils/constants';
import { getChunks } from '../chunks';
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
    this.props.commands.forEach((command) => {
      if (command.combo && handleKey(e, command.combo)) {
        e.preventDefault();
        this.props.onKeyCommand(command);
      }
    });
  }

  handleChange(e) {
    const { onChange } = this.props;
    const chunks = getChunks(e.target);

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
