/**
 * Ionicons icon set component.
 * Usage: <Ionicons name="icon-name" size={20} color="#4F8EF7" />
 */

import { createIconSet,createIconSetFromIcoMoon } from 'react-native-vector-icons';

const glyphMap = {
    "dengluweixin": 58881,
    "dengluqq": 58882,
    "tianxieziliaoweibo": 58891
};

let Ionicons = createIconSet(glyphMap, 'Ionicons', 'isweishang.ttf');
module.exports = Ionicons;
module.exports.glyphMap = glyphMap;

