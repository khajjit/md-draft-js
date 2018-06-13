import { skip, trim, findTags } from '../chunks';

const rtextbefore = /\S[ ]*$/;
const rtextafter = /^[ ]*\S/;
const rnewline = /\n/;
const rbacktick = /`/;
const rfencebefore = /```[a-z]*\n?$/;
const rfencebeforeinside = /^```[a-z]*\n/;
const rfenceafter = /^\n?```/;
const rfenceafterinside = /\n```$/;

export function isCodeInline(chunks) {
  let outfencedAfter = false;
  let outfencedBefore = false;

  let strBefore = chunks.before.split('\n')
  strBefore = strBefore[strBefore.length - 1]
  let strAfter = chunks.after.split('\n')[0]

  const matchBefore = strBefore.match(/[`]/g);
  const matchAfter = strAfter.match(/[`]/g);

  if (matchBefore && matchBefore.length % 2) {
    outfencedAfter = true;
  }
  if (matchAfter && matchAfter.length % 2) {
    outfencedBefore = true;
  }

  return outfencedAfter && outfencedBefore;
}

export function isCodeBlock(chunks) {
  let outfencedAfter = false;
  let outfencedBefore = false;
  const matchBefore = chunks.before.match(/```[/\n]/g);
  const matchAfter = chunks.after.match(/[/\n]```/g);

  if (matchBefore && matchBefore.length % 2) {
    outfencedAfter = true;
  }
  if (matchAfter && matchAfter.length % 2) {
    outfencedBefore = true;
  }

  return outfencedAfter && outfencedBefore;
}

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
