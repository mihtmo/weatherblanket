import './Loader.css'

// Loading icon with animated bars
// bar-loader will take the space of parent div!
const BarLoader = ( ) => {
    return (
        <div className='bar-loader-wrapper'>
            <div className='bar-loader'>
                <svg viewBox='0 0 24 24'>
                    <defs>
                        <linearGradient id='gradient1' gradientUnits="userSpaceOnUse" x1='0%' y1='0%' x2='0%' y2='100%'>
                            <stop offset='0%' stopOpacity='100%' stopColor='#6bbcd1'/>
                            <stop offset='100%' stopOpacity='100%' stopColor='#2c48b8'/>
                        </linearGradient>
                        <linearGradient id='gradient2' gradientUnits="userSpaceOnUse" x1='0%' y1='0%' x2='0%' y2='100%'>
                            <stop offset='0%' stopOpacity='100%' stopColor='#fff2ce'/>
                            <stop offset='100%' stopOpacity='100%' stopColor='#6bbcd1'/>
                        </linearGradient>
                        <linearGradient id='gradient3' gradientUnits="userSpaceOnUse" x1='0%' y1='0%' x2='0%' y2='100%'>
                            <stop offset='0%' stopOpacity='100%' stopColor='#fd9415'/>
                            <stop offset='100%' stopOpacity='100%' stopColor='#fff2ce'/>
                        </linearGradient>
                        <linearGradient id='gradient4' gradientUnits="userSpaceOnUse" x1='0%' y1='0%' x2='0%' y2='100%'>
                            <stop offset='0%' stopOpacity='100%' stopColor='#d95700'/>
                            <stop offset='100%' stopOpacity='100%' stopColor='#fd9415'/>
                        </linearGradient>
                        <linearGradient id='gradient5' gradientUnits="userSpaceOnUse" x1='0%' y1='0%' x2='0%' y2='100%'>
                            <stop offset='0%' stopOpacity='100%' stopColor='#962101'/>
                            <stop offset='100%' stopOpacity='100%' stopColor='#d95700'/>
                        </linearGradient>
                    </defs>
                    <line stroke='url(#gradient1)' x1="2" y1="14" x2="2" y2="24" strokeWidth='4'>
                        <animate
                            attributeName='y1'
                            values='14;14;6;14'
                            dur='1.5s'
                            repeatCount='indefinite'
                            calcMode='spline'
                            keyTimes='0;0.33;0.66;1'
                            keySplines='0.55 0 0.45 1; 0.55 0 0.45 1; 0.55 0 0.45 1;'
                            begin='.1'/>
                    </line>
                    <line stroke='url(#gradient2)' x1="7"  y1="14" x2="7" y2="24" strokeWidth='4'>
                        <animate
                            attributeName='y1'
                            values='14;14;6;14'
                            dur='1.5s'
                            repeatCount='indefinite'
                            calcMode='spline'
                            keyTimes='0;0.33;0.66;1'
                            keySplines='0.55 0 0.45 1; 0.55 0 0.45 1; 0.55 0 0.45 1;'
                            begin='.2'/>
                    </line>
                    <line stroke='url(#gradient3)' x1="12"  y1="14" x2="12" y2="24" strokeWidth='4'>
                        <animate
                            attributeName='y1'
                            values='14;14;6;14'
                            dur='1.5s'
                            repeatCount='indefinite'
                            calcMode='spline'
                            keyTimes='0;0.33;0.66;1'
                            keySplines='0.55 0 0.45 1; 0.55 0 0.45 1; 0.55 0 0.45 1;'
                            begin='.3'/>
                    </line>
                    <line stroke='url(#gradient4)' x1="17"  y1="14" x2="17" y2="24" strokeWidth='4'>
                        <animate
                            attributeName='y1'
                            values='14;14;6;14'
                            dur='1.5s'
                            repeatCount='indefinite'
                            calcMode='spline'
                            keyTimes='0;0.33;0.66;1'
                            keySplines='0.55 0 0.45 1; 0.55 0 0.45 1; 0.55 0 0.45 1;'
                            begin='.4'/>
                    </line>
                    <line stroke='url(#gradient5)' x1="22"  y1="14" x2="22" y2="24" strokeWidth='4'>
                        <animate
                            attributeName='y1'
                            values='14;14;6;14'
                            dur='1.5s'
                            repeatCount='indefinite'
                            calcMode='spline'
                            keyTimes='0;0.33;0.66;1'
                            keySplines='0.55 0 0.45 1; 0.55 0 0.45 1; 0.55 0 0.45 1;'
                            begin='.5'/>
                    </line>
                </svg>
            </div>
        </div>
    )
}

export default BarLoader