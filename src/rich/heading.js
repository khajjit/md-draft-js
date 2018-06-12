import { skip, findTags } from '../chunks';
import many from '../utils/many';

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
