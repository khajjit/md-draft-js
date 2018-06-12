import { findTags, trim } from '../chunks';

function createStartTag(linkText, url, isMedia = false) {
  linkText = (linkText === '') ? 'link_text' : linkText
  return isMedia ?
    `![${linkText}][${url}]` :
    `[${linkText}](${url})`
}

export default function linkOrMediaOrAttachment(chunks, url, type) {
  if (!url) {
    return chunks;
  }

  const isMedia = type === 'media';
  let result = findTags(trim(chunks), /\s*!?\[/, /][ ]?(?:\n[ ]*)?(\[.*?])?/);

  result.startTag = createStartTag(result.selection, url, isMedia);
  result.selection = '';
  result.endTag = '';
  return result;
}
