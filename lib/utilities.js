import { interpolate, separate, splitPathString, toCircle } from 'flubber';
import clamp from 'lodash.clamp';
import memoize from 'memoize-one';
export const getFirstStep = (steps) => steps &&
    Object.values(steps).reduce((a, b) => (!a || a.order > b.order ? b : a), null);
export const getLastStep = (steps) => steps &&
    Object.values(steps).reduce((a, b) => (!a || a.order < b.order ? b : a), null);
export const getStepNumber = (steps, step) => step &&
    Object.values(steps).filter((_step) => _step.order <= step.order).length;
export const getPrevStep = (steps, step) => Object.values(steps)
    .filter((_step) => _step.order < step.order)
    .reduce((a, b) => (!a || a.order < b.order ? b : a), null);
export const getNextStep = (steps, step) => Object.values(steps)
    .filter((_step) => _step.order > step.order)
    .reduce((a, b) => (!a || a.order > b.order ? b : a), null) ||
    step;
const headPath = /^M0,0H\d*\.?\d*V\d*\.?\d*H0V0Z/;
const cleanPath = memoize((path) => path.replace(headPath, '').trim());
const getCanvasPath = memoize((path) => {
    const canvasPath = path.match(headPath);
    if (canvasPath) {
        return canvasPath[0];
    }
    return '';
});
const getBorderRadiusOrDefault = (borderRadius, defaultRadius = 0) => (borderRadius || borderRadius === 0 ? borderRadius : defaultRadius);
export const defaultSvgPath = ({ size, position, borderRadius: radius, borderRadiusObject, }) => {
    if (radius || borderRadiusObject) {
        const borderRadiusTopRight = getBorderRadiusOrDefault(borderRadiusObject === null || borderRadiusObject === void 0 ? void 0 : borderRadiusObject.topRight, radius);
        const borderRadiusTopLeft = getBorderRadiusOrDefault(borderRadiusObject === null || borderRadiusObject === void 0 ? void 0 : borderRadiusObject.topLeft, radius);
        const borderRadiusBottomRight = getBorderRadiusOrDefault(borderRadiusObject === null || borderRadiusObject === void 0 ? void 0 : borderRadiusObject.bottomRight, radius);
        const borderRadiusBottomLeft = getBorderRadiusOrDefault(borderRadiusObject === null || borderRadiusObject === void 0 ? void 0 : borderRadiusObject.bottomLeft, radius);
        return `M${position.x},${position.y}H${position.x + size.x} a${borderRadiusTopRight},${borderRadiusTopRight} 0 0 1 ${borderRadiusTopRight},${borderRadiusTopRight}V${position.y + size.y - borderRadiusTopRight} a${borderRadiusBottomRight},${borderRadiusBottomRight} 0 0 1 -${borderRadiusBottomRight},${borderRadiusBottomRight}H${position.x} a${borderRadiusBottomLeft},${borderRadiusBottomLeft} 0 0 1 -${borderRadiusBottomLeft},-${borderRadiusBottomLeft}V${position.y +
            (borderRadiusBottomLeft > borderRadiusTopLeft
                ? borderRadiusTopLeft
                : borderRadiusBottomLeft)} a${borderRadiusTopLeft},${borderRadiusTopLeft} 0 0 1 ${borderRadiusTopLeft},-${borderRadiusTopLeft}Z`;
    }
    return `M${position.x},${position.y}H${position.x + size.x}V${position.y + size.y}H${position.x}V${position.y}Z`;
};
export const circleSvgPath = ({ size, position, }) => {
    const radius = Math.round(Math.max(size.x, size.y) / 2);
    return [
        `M${position.x - size.x / 8},${position.y + size.y / 2}`,
        `a${radius} ${radius} 0 1 0 ${radius * 2} 0 ${radius} ${radius} 0 1 0-${radius * 2} 0`,
    ].join('');
};
const sizeOffset = memoize((size, maskOffset = 0) => maskOffset
    ? {
        x: size.x + maskOffset,
        y: size.y + maskOffset,
    }
    : size);
const positionOffset = memoize((position, maskOffset = 0) => maskOffset
    ? {
        x: position.x - maskOffset / 2,
        y: position.y - maskOffset / 2,
    }
    : position);
const getMaxSegmentLength = memoize((shape) => {
    switch (shape) {
        case 'circle':
        case 'circle_and_keep':
            return 7;
        case 'rectangle_and_keep':
            return 25;
        default:
            return 15;
    }
});
const getSplitPathSliceOne = memoize((path) => {
    const splitPath = splitPathString(path);
    return splitPath.length > 1 ? splitPath.slice(1).join('') : path;
});
const getInterpolator = memoize((previousPath, shape, position, size, maskOffset = 0, borderRadius = 0, borderRadiusObject) => {
    const options = {
        maxSegmentLength: getMaxSegmentLength(shape),
    };
    const optionsKeep = { single: true };
    const getDefaultInterpolate = () => interpolate(previousPath, defaultSvgPath({
        size: sizeOffset(size, maskOffset),
        position: positionOffset(position, maskOffset),
        borderRadius,
        borderRadiusObject,
    }), options);
    const getCircleInterpolator = () => toCircle(previousPath, position.x + size.x / 2, position.y + size.y / 2, Math.max(size.x, size.y) / 2 + maskOffset, options);
    switch (shape) {
        case 'circle':
            return getCircleInterpolator();
        case 'rectangle':
            return getDefaultInterpolate();
        case 'circle_and_keep': {
            const path = getSplitPathSliceOne(previousPath);
            return separate(previousPath, [
                path,
                circleSvgPath({ size: sizeOffset(size, maskOffset), position }),
            ], optionsKeep);
        }
        case 'rectangle_and_keep': {
            const path = getSplitPathSliceOne(previousPath);
            return separate(previousPath, [
                path,
                defaultSvgPath({
                    size: sizeOffset(size, maskOffset),
                    position: positionOffset(position, maskOffset),
                    borderRadius,
                    borderRadiusObject,
                }),
            ], optionsKeep);
        }
        default:
            return getDefaultInterpolate();
    }
});
export const svgMaskPathMorph = ({ previousPath, animation, to: { position, size, shape, maskOffset, borderRadius, borderRadiusObject }, }) => {
    const interpolator = getInterpolator(cleanPath(previousPath), shape, position, size, maskOffset, borderRadius, borderRadiusObject);
    return `${getCanvasPath(previousPath)}${interpolator(clamp(animation._value, 0, 1))}`;
};
