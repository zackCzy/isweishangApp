/**
 * MyIcon icon set component.
 * Usage: <MyIcon name="icon-name" size={20} color="#4F8EF7" />
 */

import createIconSet from './lib/create-icon-set';
const glyphMap = {
  "dengluweixin": 58881,
  "dengluqq": 58882,
  "tianxieziliaoweibo": 58891
};

let MyIcon = createIconSet(glyphMap, 'myicon', 'MyIcon.ttf');

module.exports = MyIcon;
module.exports.glyphMap = glyphMap;

