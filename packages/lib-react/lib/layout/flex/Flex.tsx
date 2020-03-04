import Grid, {
    GridContentAlignment,
    GridDirection,
    GridItemsAlignment,
    GridJustification,
    GridWrap,
    GridSpacing,
    GridSize
} from '@material-ui/core/Grid';
import * as _ from 'lodash';
import React, { ReactNode, ReactNodeArray } from 'react';

/**
 * Takes a list of elements and returns a new list of only truthy results.
 * Any element that is a function will be executed and if the result is a truthy value, it will be included.
 * Any falsy elements will be excluded.
 * @param {Array<*>} array - list of elements
 * @returns {Array<*>} - list of only truthy values
 */
const selectTruthyResults = <T, > (array: Array<T>): Array<T> => {
    const list = [].concat(array);
    return list.reduce((acc: Array<T>, element: T) => {
        const item = typeof element === 'function'
            ? element()
            : element;

        return item
            ? acc.concat(item)
            : acc;
    }, []);
};

const waterfallValues = <T, > (defaultValue: T, valueArray: T[]): T[] => {
    const len = valueArray.length;
    if (valueArray.length > 0) {
        const value = valueArray[0] || defaultValue;
        if (len > 1) {
            return [value, ...waterfallValues(value, _.takeRight(valueArray, len - 1))];
        }
        return [value];
    }
    return [];
};

/**
 * https://www.w3schools.com/cssref/pr_text_text-align.asp
 */
export type TextAlign = 'left' | 'right' | 'center' | 'justify' | 'initial' | 'inherit';

type FlexProps = {
    alignContent?: GridContentAlignment;
    alignItems?: GridItemsAlignment;
    children: ReactNode | ReactNodeArray;
    className?: string;
    containerClassName?: string;
    direction?: GridDirection;
    justify?: GridJustification;
    spacing?: GridSpacing;
    textAlign?: TextAlign;
    wrap?: GridWrap;
    xs?: GridSize;
    sm?: GridSize;
    md?: GridSize;
    lg?: GridSize;
    xl?: GridSize;
};

/**
 * @description wraps elements in the flex layout as implemented by MaterialUI
 *   DEFINITIONS:
 *     container - wraps flexbox items in a flexbox container
 *     item(s) - wraps element(s) in a flexbox item
 *     element(s) - lowest level of the flexbox layout; the children of this component
 *   RESOURCES:
 *      https://material-ui.com/api/grid/
 *      https://the-echoplex.net/flexyboxes/
 *      https://css-tricks.com/snippets/css/a-guide-to-flexbox/
 * @param {GridContentAlignment} alignContent - defines alignment for item lines within the container
 * @param {GridItemsAlignment} alignItems - defines alignment perpendicular to the main axis
 * @param {ReactNode | ReactNodeArray} children - element(s), component(s)
 * @param {string} className - jss class on each item
 * @param {string} containerClassName - jss class on the container
 * @param {GridDirection} direction - the main axis; direction in which items will flow in a container
 * @param {GridJustification} justify - defines alignment along the main axis
 * @param {GridSpacing} spacing - margin between items - ((0 thru 10) * theme spacing unit)px
 * @param {TextAlign} textAlign - element alignment within each item
 * @param {GridWrap} wrap - how to place items overflowing the container
 * @param {GridSize} xs - (auto, 0-12) number of gutters per item at the given breakpoint
 * @param {GridSize} sm - (auto, 0-12) number of gutters per item at the given breakpoint
 * @param {GridSize} md - (auto, 0-12) number of gutters per item at the given breakpoint
 * @param {GridSize} lg - (auto, 0-12) number of gutters per item at the given breakpoint
 * @param {GridSize} xl - (auto, 0-12) number of gutters per item at the given breakpoint
 * @return {*} - the children you passed in, wrapped in grid items
 * @constructor
 */
const Flex = ({
    alignContent = 'flex-start',
    alignItems = 'stretch',
    children,
    className,
    containerClassName,
    direction = 'column',
    justify = 'flex-start',
    spacing = 0,
    textAlign = 'center',
    wrap = 'nowrap',
    xs,
    sm,
    md,
    lg,
    xl
}: FlexProps): ReactNode => {
    const [xsVal, smVal, mdVal, lgVal, xlVal] = waterfallValues<GridSize>('auto', [xs, sm, md, lg, xl]);
    const childrenArray = Array.isArray(children) ? children : [children];
    const truthyChildren = selectTruthyResults(childrenArray);
    return (
        <Grid
            alignContent={alignContent}
            alignItems={alignItems}
            className={containerClassName}
            container={true}
            direction={direction}
            justify={justify}
            spacing={spacing}
            wrap={wrap}
        >
            {truthyChildren.map((child, index) => (
                <Grid
                    className={className}
                    item={true}
                    key={index}
                    lg={lgVal}
                    md={mdVal}
                    sm={smVal}
                    style={{ textAlign: textAlign }}
                    xl={xlVal}
                    xs={xsVal}
                >
                    {child}
                </Grid>
            ))}
        </Grid>
    );
};

export default Flex;
