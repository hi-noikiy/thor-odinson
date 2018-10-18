// Type definitions for react-swipeable-views-utils 0.12
// Project: https://github.com/oliviertassinari/react-swipeable-views

declare module 'react-swipeable-views-utils' {
    import * as React from 'react'

    export interface IAutoPlayProps {
        /**
         * If `false`, the auto play behavior is disabled.
         */
        autoplay: boolean
        /**
         * This is the auto play direction.
         */
        direction?: 'incremental' | 'decremental'
        /**
         * @ignore
         */
        index?: number
        /**
         * Delay between auto play transitions (in ms).
         */
        interval: number
        /**
         * @ignore
         */
        onChangeIndex?: (index: number, indexLatest?: number) => void
        /**
         * @ignore
         */
        onSwitching?: (index: number, type: 'move' | 'end') => void
        /**
         * @ignore
         */
        slideCount?: number
    }
    
    export type AutoPlaySwipeableViews = React.ComponentClass<IAutoPlayProps>
    
    export function autoPlay(MyComponent: React.ComponentClass): AutoPlaySwipeableViews
}
