import { Typography } from '@material-ui/core';
import React from 'react';

const PanelComponent = ({fps, loadTime, progress}) => {
    return (
        <>
            <div style={{
                position: 'absolute',
                backgroundColor: '#ffffff',
                borderRadius: '6px',
                margin: '16px',
                padding: '8px 24px',
                top: 0,
                boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
            }}>
                <Typography variant='subtitle1' align='center' gutterBottom>
                    FPS <b>{fps}</b>
                </Typography>
            </div>
            <div style={{
                width: '50%',
                height: '18px',
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#ffffff',
                borderRadius: '25px',
                padding: '8px',
                margin: '16px',
                boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
            }}>
                <span style={{
                    height: '100%',
                    borderRadius: '16px',
                    backgroundColor: '#ADFF2F',
                    boxShadow: 'inset 0 2px 9px  rgba(255,255,255,0.3),inset 0 -2px 6px rgba(0,0,0,0.4)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: `${progress}%`,
                }}>
                    {progress} %
                </span>
            </div>
        </>
    );
};

export default PanelComponent;