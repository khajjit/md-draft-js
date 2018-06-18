import { skip, findTags } from '../chunks';
import many from '../utils/many';

const numberOfDefaultHeader = 2

export default function heading(chunks, level) {
  let calculatedLevel = 0;
  let result = Object.assign({}, chunks);
  level = Number(level)

  result.selection = result.selection
    .replace(/\s+/g, ' ')
    .replace(/(^\s+|\s+$)/g, '');

  result = findTags(result, /#+[ ]*/, /[ ]*#+/);

  const textBefore = result.before + result.startTag;
  const currentText = textBefore.substring(textBefore.lastIndexOf('\n'));

  if (/#+/.test(currentText)) {
    calculatedLevel = RegExp.lastMatch.length;
  }

  result.startTag = result.endTag = '';
  result = findTags(result, null, /\s?(-+|=+)/);

  result.startTag = result.endTag = '';
  result = skip(result, { before: 1, after: 1 });

  const levelToCreate = (calculatedLevel === level) ? 0 : level

  if (levelToCreate > 0) {
    result.startTag = `${many('#', levelToCreate)} `;
  }

  return result;
}

export function isHeading(chunks) {
  const matchBefore = chunks.inlineSelection.strBefore.match(/^[#]{1,6} (.*)$/g);
  let nextLines = chunks.after.split('\n')

  if (chunks.inlineSelection.strBefore.match(/[=][=](.*)/g) && chunks.inlineSelection.strAfter.match(/(.*)[=][=]/g)) {
    return numberOfDefaultHeader
  }

  if (nextLines && Array.isArray(nextLines) && nextLines[1]) {
    if (nextLines[1].slice(0, 2) === '==') {
      return numberOfDefaultHeader
    }
  }

  if (matchBefore) {
    return matchBefore[0].split(' ')[0].length
  }

  return false
}
