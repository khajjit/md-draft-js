import linkOrMedia from './linkOrMediaOrAttachment';
import code, { isCodeInline, isCodeBlock } from './codeblock';
import quote, { isBlockQoute } from './blockquote';
import heading, { isHeading } from './heading';
import italic, { isItalic } from './italic';
import bold, { isBold } from './bold';
import list, { isList } from './list';
import notebook from './notebook';
import hr from './hr';

export function applyCommand(editorState, command, metadata) {
  const state = Object.assign({}, editorState, { focus: true });

  switch (command) {
    case 'bold':
      return bold(state);
    case 'italic':
      return italic(state);
    case 'hr':
      return hr(state);
    case 'quote':
      return quote(state);
    case 'code-block':
      return code(state, false);
    case 'code-inline':
      return code(state, true);
    case 'notebook':
      return notebook(state, metadata);
    case 'ul':
      return list(state, false);
    case 'ol':
      return list(state, true);
    case 'heading':
      return heading(state, metadata);
    case 'link':
      return linkOrMedia(state, metadata, 'link');
    case 'media':
      return linkOrMedia(state, metadata, 'media');
    default:
      return state;
  }
}

export function isApplied(state, command) {
  let _strBefore = state.before.split('\n');
  const inlineSelection = {
    strBefore: _strBefore[_strBefore.length - 1],
    strAfter: state.after.split('\n')[0]
  };

  switch (command) {
    case 'bold':
      return isBold(inlineSelection);
    case 'italic':
      return isItalic(inlineSelection);
    case 'quote':
      return isBlockQoute(inlineSelection);
    case 'code-inline':
      return isCodeInline(inlineSelection);
    case 'code-block':
      return isCodeBlock(state);
    case 'heading':
      return isHeading(state);
    case 'ul':
      return isList(inlineSelection, false);
    case 'ol':
      return isList(inlineSelection, true);
    default:
      return false;
  }
}
