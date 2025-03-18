import React from 'react'

const Loading = () => {
    return (
        <div style={{ width: "100vw", height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <div className='loader'></div>
            <p className='s'>Setting up everything...</p>
        </div>
    )
}

export default Loading