import { AppBar, Button, Container, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import BabylonImage from '../images/babylonjs.png';
import ThreeImage from '../images/threejs.png';

const HomePage = (props) => {
    return (
        <div>
            <AppBar position='static'>
                <Toolbar>
                    <Typography variant='h6' color='inherit' noWrap>
                        WebGL frameworks benchmark
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth='md'>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignContent: 'center',
                    flexWrap: 'wrap',
                    margin: '36px 0'
                }}>
                    <img src={ThreeImage} alt="ThreeJS" style={{
                        height: '120px',
                        width: 'auto',
                        objectFit: 'contain'
                        }}/>
                    <img src={BabylonImage} alt="BabylonJS" style={{
                        height: '120px',
                        width: 'auto',
                        objectFit: 'contain'
                        }}/>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    margin: '36px 0'
                }}>
                    <Button variant="contained" color="primary" onClick={() => props.history.push('/three-js')}>
                        Start test
                    </Button>
                </div>
            </Container>
            <footer style={{
                margin: '36px 0'
            }}>
                <Typography variant='h6' align='center' gutterBottom>
                    Authors:
                </Typography>
                <Typography variant='subtitle1' align='center' color='textSecondary' component='p'>
                    Marek Dorosz & Mateusz Wenski
                </Typography>
            </footer>
        </div>
    );
};

export default HomePage;