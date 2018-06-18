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

    // let strBefore = chunks.before.split('\n')
    // strBefore = strBefore[strBefore.length - 1]
    // let strAfter = chunks.after.split('\n')
    // strAfter = strAfter[0]
    //
    // const spaceBefore = (!strBefore[strBefore.length - 1] || strBefore[strBefore.length - 1] === ' ') ? '' : ' '
    // const spaceAfter = (!strAfter[0] || strAfter[0] === ' ') ? '' : ' '
    //
    // result.before += spaceBefore + markup;
    // result.after = markup + spaceAfter + result.after;

    result.before += markup;
    result.after = markup  + result.after;
  }

  return result;
}

export function isItalic(chunks) {
  const matchBefore = chunks.inlineSelection.strBefore.match(/[_]/g);
  const matchAfter = chunks.inlineSelection.strAfter.match(/[_]/g);

  if (
    matchBefore && matchAfter &&
    matchBefore.length % 2 &&
    matchAfter.length % 2
  ) {
    return true
  } else {
    return false
  }
}

// export function isItalic(inlineSelection) {
//   const matchBefore = inlineSelection.strBefore.match(/[_](.*)/g);
//   const matchAfter = inlineSelection.strAfter.match(/(.*)[_]/g);
//
//   if (matchBefore && matchAfter) {
//     let flag1 = false, flag2 = false;
//
//     const before = matchBefore[0];
//     const arrBefore = before.split(' ');
//     const stringsBefore = inlineSelection.strBefore.split(' ');
//     if (
//       Array.isArray(arrBefore) &&
//       arrBefore[arrBefore.length - 1].match(/[_]/g) &&
//       arrBefore[arrBefore.length - 1].match(/[_]/g).length === 1 &&
//       arrBefore[arrBefore.length - 1][0] === '_' &&
//       stringsBefore[stringsBefore.length - 1] === arrBefore[arrBefore.length - 1]
//     ) {
//       flag1 = true
//     }
//
//     const after = matchAfter[0];
//     const arrAfter = after.split(' ');
//     const stringsAfter = inlineSelection.strAfter.split(' ');
//     if (
//       Array.isArray(arrAfter) &&
//       arrAfter[0].match(/[_]/g) &&
//       arrAfter[0].match(/[_]/g).length === 1 &&
//       arrAfter[0][arrAfter[0].length - 1] === '_' &&
//       stringsAfter[0] === arrAfter[0]
//     ) {
//       flag2 = true
//     }
//
//     return flag1 && flag2;
//   }
//
//   return false;
// }
