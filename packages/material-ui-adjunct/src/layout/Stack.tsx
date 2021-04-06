import Grid, { GridProps } from '@material-ui/core/Grid'
import concat from 'lodash.concat'
import takeRight from 'lodash.takeright'
import React from 'react'

/**
 * Takes a list of elements and returns a new list of only truthy results.
 * Any element that is a function will be executed and if the result is a truthy value, it will be included.
 * Any falsy elements will be excluded.
 * @param {Array<*>} array - list of elements
 * @returns {Array<*>} - list of only truthy values
 */
const selectTruthyResults = <T, > (array: Array<T>): Array<T> => {
    const list = concat([], array) // this will prevent nested arrays 1 level down
    return list.reduce((acc: Array<T>, element: T) => {
        const item: unknown = typeof element === 'function'
            ? element()
            : element

        return item
            ? acc.concat(item as T)
            : acc
    }, [])
}

const waterfallValues = <T, > (defaultValue: T, valueArray: T[]): T[] => {
    if (valueArray.length > 0) {
        const value = valueArray[0] || defaultValue
        if (valueArray.length > 1) {
            return [value, ...waterfallValues(value, takeRight(valueArray, valueArray.length - 1))]
        }
        return [value]
    }
    return []
}

export interface IStackProps {
    alignContent?: GridProps['alignContent'], // defines alignment for item lines within the container
    alignItems?: GridProps['alignItems'], // defines alignment perpendicular to the main axis
    elementClassName?: string,
    containerClassName?: string,
    direction: GridProps['direction'], // the main axis; direction in which items will flow in a container
    justify?: GridProps['justify'], // defines alignment along the main axis
    spacing?: GridProps['spacing'], // margin between items - ((0 thru 10) * theme spacing unit)px
    containerStyle?: React.CSSProperties,
    elementStyle?: React.CSSProperties,
    wrap?: GridProps['wrap'], // how to place items overflowing the container
    xs?: GridProps['xs'],
    sm?: GridProps['sm'],
    md?: GridProps['md'],
    lg?: GridProps['lg'],
    xl?: GridProps['xl'],
}

/**
 * @description wraps elements in the flex layout as implemented by Material-UI
 *   DEFINITIONS:
 *     container - wraps flexbox items in a flexbox container
 *     item(s) - wraps element(s) in a flexbox item
 *     element(s) - lowest level of the flexbox layout; the children of this component
 *   RESOURCES:
 *      https://material-ui.com/api/grid/
 *      https://the-echoplex.net/flexyboxes/
 *      https://css-tricks.com/snippets/css/a-guide-to-flexbox/
 */
const Stack: React.FunctionComponent<IStackProps> = ({
    alignContent = 'flex-start',
    alignItems = 'stretch',
    children,
    elementClassName,
    containerClassName,
    direction,
    justify = 'flex-start',
    spacing = 0,
    containerStyle,
    elementStyle,
    wrap = 'nowrap',
    xs,
    sm,
    md,
    lg,
    xl,
}) => {
    const elements = React.useMemo(() => {
        const [xsVal, smVal, mdVal, lgVal, xlVal] = waterfallValues<GridProps['xs']>('auto', [xs, sm, md, lg, xl])
        const childrenArray = Array.isArray(children)
            ? children
            : [children]
        const truthyChildren = selectTruthyResults(childrenArray)
        return truthyChildren.map((child, index) => (
            <Grid
                className={elementClassName}
                item={true}
                key={index}
                lg={lgVal}
                md={mdVal}
                sm={smVal}
                style={elementStyle}
                xl={xlVal}
                xs={xsVal}
            >
                {child}
            </Grid>
        ))
    }, [elementClassName, children, xs, sm, md, lg, xl, elementStyle])

    return (
        <Grid
            alignContent={alignContent}
            alignItems={alignItems}
            className={containerClassName}
            container={true}
            direction={direction}
            justify={justify}
            spacing={spacing}
            style={containerStyle}
            wrap={wrap}
        >
            {elements}
        </Grid>
    )
}

export default Stack
