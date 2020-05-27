import {
  Step,
  Steps,
  SVGMaskPathMorphParam,
  ValueXY,
  Shape,
  SvgPath,
} from './types'
// @ts-ignore
import { interpolate, toCircle, separate } from 'flubber'
import memoize from 'lodash.memoize'
import clamp from 'lodash.clamp'

export const getFirstStep = (steps: Steps): Step | null =>
  steps &&
  Object.values(steps).reduce(
    (a: Step | null, b) => (!a || a.order > b.order ? b : a),
    null,
  )

export const getLastStep = (steps: Steps): Step | null =>
  steps &&
  Object.values(steps).reduce(
    (a: Step | null, b) => (!a || a.order < b.order ? b : a),
    null,
  )

export const getStepNumber = (steps: Steps, step?: Step): number | undefined =>
  step &&
  Object.values(steps).filter((_step) => _step.order <= step.order).length

export const getPrevStep = (steps: Steps, step?: Step): Step | null =>
  Object.values(steps)
    .filter((_step) => _step.order < step!.order)
    .reduce((a: Step | null, b) => (!a || a.order < b.order ? b : a), null)

export const getNextStep = (
  steps: Steps,
  step?: Step,
): Step | null | undefined =>
  Object.values(steps)
    .filter((_step) => _step.order > step!.order)
    .reduce((a: Step | null, b) => (!a || a.order > b.order ? b : a), null) ||
  step

export const hasTwoPath = (pathOrPaths: string | string[]) =>
  typeof pathOrPaths !== 'string' && Array.isArray(pathOrPaths)

export const getFirstPath = (pathOrPaths: string | string[]): string =>
  (!hasTwoPath(pathOrPaths) ? pathOrPaths : pathOrPaths[0]) as string

export const getSecondPath = (pathOrPaths: string | string[]) =>
  hasTwoPath(pathOrPaths) ? pathOrPaths[1] : undefined

const headPath = /^M0,0H\d*\.?\d*V\d*\.?\d*H0V0Z/
const cleanPath = memoize((path: string) => path.replace(headPath, '').trim())
const getCanvasPath = memoize((path: string) => {
  const canvasPath = path.match(headPath)
  if (canvasPath) {
    return canvasPath[0]
  }
  return ''
})

export const defaultSvgPath = ({
  size,
  position,
  borderRadius: radius,
}: {
  size: ValueXY
  position: ValueXY
  borderRadius: number
}): SvgPath => {
  if (radius) {
    return `M${position.x},${position.y}H${
      position.x + size.x
    } a${radius},${radius} 0 0 1 ${radius},${radius}V${
      position.y + size.y - radius
    } a${radius},${radius} 0 0 1 -${radius},${radius}H${
      position.x
    } a${radius},${radius} 0 0 1 -${radius},-${radius}V${
      position.y + radius
    } a${radius},${radius} 0 0 1 ${radius},-${radius}Z`
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
  const radius = Math.max(size.x, size.y) / 2
  return `M${position.x},${position.y}A${radius} ${radius} 0 1 0 ${
    radius * 2
  } 0 ${radius} ${radius} 0 1 0 -${radius * 2} 0`
}

const sizeOffset = (size: ValueXY, maskOffset: number = 0) =>
  maskOffset
    ? {
        x: size.x + maskOffset,
        y: size.y + maskOffset,
      }
    : size

const positionOffset = (position: ValueXY, maskOffset: number = 0) =>
  maskOffset
    ? {
        x: position.x - maskOffset / 2,
        y: position.y - maskOffset / 2,
      }
    : position

const getInterpolator = (
  previousPath: string,
  shape: Shape,
  position: ValueXY,
  size: ValueXY,
  maskOffset: number = 0,
  borderRadius: number = 0,
) => {
  const options = { maxSegmentLength: 5 }
  const optionsKeep = { single: true }
  const getDefaultInterpolate = () =>
    interpolate(
      previousPath,
      defaultSvgPath({
        size: sizeOffset(size, maskOffset),
        position: positionOffset(position, maskOffset),
        borderRadius,
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
    case 'circle_and_keep':
      return separate(
        previousPath,
        [
          previousPath,
          circleSvgPath({ size: sizeOffset(size, maskOffset), position }),
        ],
        optionsKeep,
      )
    case 'rectangle_and_keep':
      return separate(
        previousPath,
        [
          previousPath,
          defaultSvgPath({
            size: sizeOffset(size, maskOffset),
            position: positionOffset(position, maskOffset),
            borderRadius,
          }),
        ],
        optionsKeep,
      )
    default:
      return getDefaultInterpolate()
  }
}

export const svgMaskPathMorph = ({
  previousPath,
  animation,
  to: { position, size, shape, maskOffset, borderRadius },
}: SVGMaskPathMorphParam) => {
  const interpolator = getInterpolator(
    cleanPath(previousPath),
    shape!,
    position,
    size,
    maskOffset,
    borderRadius,
  )
  // console.warn({ interpolator })

  return `${getCanvasPath(previousPath)}${interpolator(
    clamp(animation._value, 0, 1),
  )}`
}
