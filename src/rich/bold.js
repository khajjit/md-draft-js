import { trim } from '../chunks';

export default function bold(chunks) {
  const rleading = /^(\**)/;
  const rtrailing = /(\**$)/;
  const rtrailingspace = /(\s?)$/;
  const rnewlines = /\n{2,}/g;

  const result = trim(chunks);

  result.selection = result.selection.replace(rnewlines, '\n');

  const leadStars = rtrailing.exec(result.before)[0];
  const trailStars = rleading.exec(result.after)[0];
  const stars = '\\*{2}';
  const fence = Math.min(leadStars.length, trailStars.length);

  if (fence >= 2) {
    result.before = result.before.replace(new RegExp(`${stars}$`, ''), '');
    result.after = result.after.replace(new RegExp(`^${stars}`, ''), '');
  } else if (!result.selection && trailStars) {
    result.after = result.after.replace(rleading, '');
    result.before = result.before.replace(rtrailingspace, '') + trailStars + RegExp.$1;
  } else {
    if (!result.selection && !trailStars) {
      result.selection = '';
    }

    const markup = '**';

    let strBefore = chunks.before.split('\n')
    strBefore = strBefore[strBefore.length - 1]
    let strAfter = chunks.after.split('\n')
    strAfter = strAfter[0]

    const spaceBefore = (!strBefore[strBefore.length - 1] || strBefore[strBefore.length - 1] === ' ') ? '' : ' '
    const spaceAfter = (!strAfter[0] || strAfter[0] === ' ') ? '' : ' '

    result.before += spaceBefore + markup;
    result.after = markup + spaceAfter + result.after;
  }

  return result;
}

export function isBold(inlineSelection) {
  const matchBefore = inlineSelection.strBefore.match(/[*][*](.*)/g);
  const matchAfter = inlineSelection.strAfter.match(/(.*)[*][*]/g);

  if (matchBefore && matchAfter) {
    let flag1 = false, flag2 = false;

    const before = matchBefore[0];
    const arrBefore = before.split(' ');
    const stringsBefore = inlineSelection.strBefore.split(' ');
    if (
      Array.isArray(arrBefore) &&
      arrBefore[arrBefore.length - 1].match(/[*][*]/g) &&
      arrBefore[arrBefore.length - 1].match(/[*][*]/g).length === 1 &&
      stringsBefore[stringsBefore.length - 1] === arrBefore[arrBefore.length - 1]
    ) {
      flag1 = true
    }

    const after = matchAfter[0];
    const arrAfter = after.split(' ');
    const stringsAfter = inlineSelection.strAfter.split(' ');
    if (
      Array.isArray(arrAfter) &&
      arrAfter[0].match(/[*][*]/g) &&
      arrAfter[0].match(/[*][*]/g).length === 1 &&
      stringsAfter[0] === arrAfter[0]
    ) {
      flag2 = true
    }

    return flag1 && flag2;
  }

  return false;
}
