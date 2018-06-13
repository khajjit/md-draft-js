import { trim } from '../chunks';

export default function italic(chunks) {
  const rleading = /^(_*)/;
  const rtrailing = /(_*$)/;
  const rtrailingspace = /(\s?)$/;
  const rnewlines = /\n{2,}/g;

  const result = trim(chunks);
  result.selection = result.selection.replace(rnewlines, '\n');

  const leadDash = rtrailing.exec(result.before)[0];
  const trailDash = rleading.exec(result.after)[0];
  const fence = Math.min(leadDash.length, trailDash.length);

  if (fence >= 1) {
    result.before = result.before.replace(new RegExp('_$', ''), '');
    result.after = result.after.replace(new RegExp('^_', ''), '');
  } else if (!result.selection && trailDash) {
    result.after = result.after.replace(rleading, '');
    result.before = result.before.replace(rtrailingspace, '') + trailDash + RegExp.$1;
  } else {
    if (!result.selection && !trailDash) {
      result.selection = '';
    }

    const markup = '_';
    result.before += markup;
    result.after = markup + result.after;
  }

  return result;
}

export function isItalic(inlineSelection) {
  let outfencedAfter = false;
  let outfencedBefore = false;

  const matchBefore = inlineSelection.strBefore.match(/_/g);
  const matchAfter = inlineSelection.strAfter.match(/_/g);

  if (matchBefore && matchBefore.length % 2) {
    outfencedAfter = true;
  }
  if (matchAfter && matchAfter.length % 2) {
    outfencedBefore = true;
  }

  return outfencedAfter && outfencedBefore;
}
