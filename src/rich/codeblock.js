import { skip, trim, findTags } from '../chunks';

const rtextbefore = /\S[ ]*$/;
const rtextafter = /^[ ]*\S/;
const rnewline = /\n/;
const rbacktick = /`/;
const rfencebefore = /```[a-z]*\n?$/;
const rfencebeforeinside = /^```[a-z]*\n/;
const rfenceafter = /^\n?```/;
const rfenceafterinside = /\n```$/;

export default function codeblock(chunks, isInline = false) {
  const newlined = rnewline.test(chunks.selection);
  const trailing = rtextafter.test(chunks.after);
  const leading = rtextbefore.test(chunks.before);
  const outfenced = rfencebefore.test(chunks.before) && rfenceafter.test(chunks.after);

  if (isInline) {
    return inline(chunks);
  } else {
    return block(chunks, outfenced);
  }
}

export function isCodeblock(chunks) {
  const outfenced = rfencebefore.test(chunks.before) && rfenceafter.test(chunks.after);

  return outfenced;
}

function inline(chunks) {
  let result = trim(chunks);
  result = findTags(result, rbacktick, rbacktick);

  if (!result.startTag && !result.endTag) {
    result.startTag = result.endTag = '`';

    if (!result.selection) {
      result.selection = '';
    }
  } else if (result.endTag && !result.startTag) {
    result.before += result.endTag;
    result.endTag = '';
  } else {
    result.startTag = result.endTag = '';
  }

  return result;
}

function block(chunks, outfenced) {
  let result = Object.assign({}, chunks);

  if (outfenced) {
    result.before = result.before.replace(rfencebefore, '');
    result.after = result.after.replace(rfenceafter, '');

    return result;
  }

  result.before = result.before.replace(/[ ]{4}|```[a-z]*\n$/, mergeSelection);
  result = skip(result, {
    before: /(\n|^)(\t|[ ]{4,}|```[a-z]*\n).*\n$/.test(result.before) ? 0 : 1,
    after: /^\n(\t|[ ]{4,}|\n```)/.test(result.after) ? 0 : 1
  });

  if (!result.selection) {
    result.startTag = '```\n';
    result.endTag = '\n```';
    result.selection = '';
  } else if (rfencebeforeinside.test(result.selection) && rfenceafterinside.test(result.selection)) {
    result.selection = result.selection.replace(/(^```[a-z]*\n)|(```$)/g, '');
  } else if (/^[ ]{0,3}\S/m.test(result.selection)) {
    result.before += '```\n';
    result.after = `\n\`\`\`${result.after}`;
  } else {
    result.selection = result.selection.replace(/^(?:[ ]{4}|[ ]{0,3}\t|```[a-z]*)/gm, '');
  }

  return result;

  function mergeSelection(all) {
    result.selection = all + result.selection;

    return '';
  }
}
