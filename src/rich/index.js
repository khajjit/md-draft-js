import bold, { isBold } from './bold';
import italic, { isItalic } from './italic';
import linkOrMedia from './linkOrMediaOrAttachment';
import list from './list';
import quote from './blockquote';
import code, { isCodeblock } from './codeblock';
import notebook from './notebook';
import heading from './heading';
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
      return list(state);
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
  switch (command) {
    case 'bold':
      return isBold(state);
    case 'italic':
      return isItalic(state);
    case 'code':
      return isCodeblock(state);
    default:
      return false;
  }
}
