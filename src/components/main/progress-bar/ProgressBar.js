import React from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../progress-bar/ProgressBar.css';

function ProgressBar(props) {
    return (
        <div className='progress-bar'>
            <CircularProgressbar styles={buildStyles({
                // Rotation of path and trail, in number of turns (0-1)
                rotation: 0.25,

                // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                strokeLinecap: 'round',

                // Text size
                textSize: '15px',

                // How long animation takes to go from one percentage to another, in seconds
                pathTransitionDuration: 0.5,
                // Colors
                pathColor: `indigo`,
                textColor: 'indigo',
                trailColor: '#cccccc',
                backgroundColor: '#3e98c7',
            })} value={props.percentage} strokeWidth={5} text={`${props.percentage.toFixed(1)}%`} />
        </div>
    )
}

export default ProgressBar