import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Ghost(props) {
    const { file, rank, position, type, move, initposition, team, capture, castle, promote, doubleStep, enPassant, capturing, castling, promoting, placeholder } = props

    const determineFunctions = () => {
        if(!placeholder) {
            if(doubleStep) {
                move(file, rank, position, true);
            }
            if(capture) {
                capturing(file, rank, position)
            }
            if(castle) {
                castling(position)
            }
            if(promote) {
                promoting(file, rank, position)
            }
            if(!promote && !doubleStep) {
                move(file, rank, position);
            }
        }
    }

    const determineClassName = () => {
        const first = capture ? `${team}-capture` : null;
        const second = castle ? `${team}-castle` : null;
        const third = promote ? `${team}-promote` : null;
        const fourth = enPassant ? `${team}-en-passant` : null;
        const fifth = `${team}-ghost`;
        const allClasses = `${first} ${second} ${third} ${fourth} ${fifth}`
        return(allClasses)
    }

    return (
        <div
        onClick={() => determineFunctions()}
        initposition={initposition}
        key={`ghost${position}`}
        rank={rank}
        file={file}
        position={position}
        className={determineClassName()}
        style={{
            gridArea: `${position}`,
        }}>
        <FontAwesomeIcon
        icon={ type }
        />
        </div>
    )
}
