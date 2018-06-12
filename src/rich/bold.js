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
    result.before += markup;
    result.after = markup + result.after;
  }

  return result;
}

export function isBold(chunks) {
  let outfencedAfter = false;
  let outfencedBefore = false;
  const matchBefore = chunks.before.match(/\*\*/g);
  const matchAfter = chunks.after.match(/\*\*/g);

  if (matchBefore && matchBefore.length % 2) {
    outfencedAfter = true;
  }
  if (matchAfter && matchAfter.length % 2) {
    outfencedBefore = true;
  }

  return outfencedAfter && outfencedBefore;
}
