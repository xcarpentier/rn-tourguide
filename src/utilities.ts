// @ts-ignore
import { interpolate, separate, splitPathString, toCircle } from 'flubber'
import clamp from 'lodash.clamp'
import memoize from 'memoize-one'
import {
  BorderRadiusObject,
  IStep,
  Shape,
  Steps,
  SVGMaskPathMorphParam,
  SvgPath,
  ValueXY,
} from './types'

export const getFirstStep = (steps: Steps): IStep | null =>
  steps &&
  Object.values(steps).reduce(
    (a: IStep | null, b) => (!a || a.order > b.order ? b : a),
    null,
  )

export const getLastStep = (steps: Steps): IStep | null =>
  steps &&
  Object.values(steps).reduce(
    (a: IStep | null, b) => (!a || a.order < b.order ? b : a),
    null,
  )

export const getStepNumber = (steps: Steps, step?: IStep): number | undefined =>
  step &&
  Object.values(steps).filter((_step) => _step.order <= step.order).length

export const getPrevStep = (steps: Steps, step?: IStep): IStep | null =>
  Object.values(steps)
    .filter((_step) => _step.order < step!.order)
    .reduce((a: IStep | null, b) => (!a || a.order < b.order ? b : a), null)

export const getNextStep = (
  steps: Steps,
  step?: IStep,
): IStep | null | undefined =>
  Object.values(steps)
    .filter((_step) => _step.order > step!.order)
    .reduce((a: IStep | null, b) => (!a || a.order > b.order ? b : a), null) ||
  step

const headPath = /^M0,0H\d*\.?\d*V\d*\.?\d*H0V0Z/
const cleanPath = memoize((path: string) => path.replace(headPath, '').trim())
const getCanvasPath = memoize((path: string) => {
  const canvasPath = path.match(headPath)
  if (canvasPath) {
    return canvasPath[0]
  }
  return ''
})

const getBorderRadiusOrDefault = (
  borderRadius?: number,
  defaultRadius: number = 0,
) => (borderRadius || borderRadius === 0 ? borderRadius : defaultRadius)

export const defaultSvgPath = ({
  size,
  position,
  borderRadius: radius,
  borderRadiusObject,
}: {
  size: ValueXY
  position: ValueXY
  borderRadius: number
  borderRadiusObject?: BorderRadiusObject
}): SvgPath => {
  if (radius || borderRadiusObject) {
    const borderRadiusTopRight = getBorderRadiusOrDefault(
      borderRadiusObject?.topRight,
      radius,
    )
    const borderRadiusTopLeft = getBorderRadiusOrDefault(
      borderRadiusObject?.topLeft,
      radius,
    )
    const borderRadiusBottomRight = getBorderRadiusOrDefault(
      borderRadiusObject?.bottomRight,
      radius,
    )
    const borderRadiusBottomLeft = getBorderRadiusOrDefault(
      borderRadiusObject?.bottomLeft,
      radius,
    )

    return `M${position.x},${position.y}H${
      position.x + size.x
    } a${borderRadiusTopRight},${borderRadiusTopRight} 0 0 1 ${borderRadiusTopRight},${borderRadiusTopRight}V${
      position.y + size.y - borderRadiusTopRight
    } a${borderRadiusBottomRight},${borderRadiusBottomRight} 0 0 1 -${borderRadiusBottomRight},${borderRadiusBottomRight}H${
      position.x
    } a${borderRadiusBottomLeft},${borderRadiusBottomLeft} 0 0 1 -${borderRadiusBottomLeft},-${borderRadiusBottomLeft}V${
      position.y +
      (borderRadiusBottomLeft > borderRadiusTopLeft
        ? borderRadiusTopLeft
        : borderRadiusBottomLeft)
    } a${borderRadiusTopLeft},${borderRadiusTopLeft} 0 0 1 ${borderRadiusTopLeft},-${borderRadiusTopLeft}Z`
  }
  return `M${position.x},${position.y}H${position.x + size.x}V${
    position.y + size.y
  }H${position.x}V${position.y}Z`
}

export const circleSvgPath = ({
  size,
  position,
}: {
  size: ValueXY
  position: ValueXY
}): SvgPath => {
  const radius = Math.round(Math.max(size.x, size.y) / 2)
  return [
    `M${position.x - size.x / 8},${position.y + size.y / 2}`,
    `a${radius} ${radius} 0 1 0 ${radius * 2} 0 ${radius} ${radius} 0 1 0-${
      radius * 2
    } 0`,
  ].join('')
}

const sizeOffset = memoize((size: ValueXY, maskOffset: number = 0) =>
  maskOffset
    ? {
        x: size.x + maskOffset,
        y: size.y + maskOffset,
      }
    : size,
)

const positionOffset = memoize((position: ValueXY, maskOffset: number = 0) =>
  maskOffset
    ? {
        x: position.x - maskOffset / 2,
        y: position.y - maskOffset / 2,
      }
    : position,
)

const getMaxSegmentLength = memoize((shape: Shape) => {
  switch (shape) {
    case 'circle':
    case 'circle_and_keep':
      return 7
    case 'rectangle_and_keep':
      return 25

    default:
      return 15
  }
})

const getSplitPathSliceOne = memoize((path: SvgPath) => {
  const splitPath = splitPathString(path)
  return splitPath.length > 1 ? splitPath.slice(1).join('') : path
})

const getInterpolator = memoize(
  (
    previousPath: string,
    shape: Shape,
    position: ValueXY,
    size: ValueXY,
    maskOffset: number = 0,
    borderRadius: number = 0,
    borderRadiusObject?: BorderRadiusObject,
  ) => {
    const options = {
      maxSegmentLength: getMaxSegmentLength(shape),
    }
    const optionsKeep = { single: true }
    const getDefaultInterpolate = () =>
      interpolate(
        previousPath,
        defaultSvgPath({
          size: sizeOffset(size, maskOffset),
          position: positionOffset(position, maskOffset),
          borderRadius,
          borderRadiusObject,
        }),
        options,
      )
    const getCircleInterpolator = () =>
      toCircle(
        previousPath,
        position.x + size.x / 2,
        position.y + size.y / 2,
        Math.max(size.x, size.y) / 2 + maskOffset,
        options,
      )

    switch (shape) {
      case 'circle':
        return getCircleInterpolator()
      case 'rectangle':
        return getDefaultInterpolate()
      case 'circle_and_keep': {
        const path = getSplitPathSliceOne(previousPath)
        return separate(
          previousPath,
          [
            path,
            circleSvgPath({ size: sizeOffset(size, maskOffset), position }),
          ],
          optionsKeep,
        )
      }

      case 'rectangle_and_keep': {
        const path = getSplitPathSliceOne(previousPath)
        return separate(
          previousPath,
          [
            path,
            defaultSvgPath({
              size: sizeOffset(size, maskOffset),
              position: positionOffset(position, maskOffset),
              borderRadius,
              borderRadiusObject,
            }),
          ],
          optionsKeep,
        )
      }
      default:
        return getDefaultInterpolate()
    }
  },
)

export const svgMaskPathMorph = ({
  previousPath,
  animation,
  to: { position, size, shape, maskOffset, borderRadius, borderRadiusObject },
}: SVGMaskPathMorphParam) => {
  const interpolator = getInterpolator(
    cleanPath(previousPath),
    shape!,
    position,
    size,
    maskOffset,
    borderRadius,
    borderRadiusObject,
  )

  return `${getCanvasPath(previousPath)}${interpolator(
    clamp(animation._value, 0, 1),
  )}`
}
