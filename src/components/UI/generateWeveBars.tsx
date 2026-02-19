 
 
 
 export const generateWaveBars = () => {
        const bars = [];
        for (let i = 0; i < 10; i++) {
            const height = Math.random() * 20 + 10; // Random height between 10-30px
            bars.push(
                <div 
                    key={i} 
                    className="wave-bar"
                    style={{
                        '--base-height': `${height}px`,
                        height: `${height}px`
                    } as React.CSSProperties}
                />
            );
        }
        return bars;
    };