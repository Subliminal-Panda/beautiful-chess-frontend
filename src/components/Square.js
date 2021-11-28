import React from 'react';

export default function Square(props) {
    const { file, rank, position, squareColor } = props

    return (
        <div
        key={position}
        rank={rank}
        file={file}
        position={position}
        className="square"
        style={{
            gridArea: `${position}`,
            backgroundColor: squareColor
        }}>
            <h2 className="notation" key={position}>{position}</h2>
        </div>
    )
}
