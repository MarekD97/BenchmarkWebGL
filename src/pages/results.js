import { AppBar, Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer,
  } from 'recharts';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import { deviceDetect } from 'react-device-detect';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import BabylonImage from '../images/babylonjs.png';
import ThreeImage from '../images/threejs.png';

const ResultsPage = (props) => {
    const history = useHistory();
    const [cookies] = useCookies();

    // console.log(deviceDetect());
    const loadTime = [
        {
            name: 'Czas załadowania sceny [ms]', 
            threeJS: cookies.ThreeJS.loadTime, 
            babylonJS: cookies.BabylonJS.loadTime,
        }
    ]
    var fpsTime = cookies.BabylonJS.fps.map((item, index) => {
        return {
            time: index/10, 
            threeJS: cookies.ThreeJS.fps[index],
            babylonJS: item
        }
    });
    const average = (array) => {
        let sum = 0;
        array.map(item => {
            return sum += item;
        });
        return (sum / array.length).toFixed(3);
    }
    function median(values){
        if(values.length ===0) return 0;
      
        values.sort(function(a,b){
          return a-b;
        });
      
        var half = Math.floor(values.length / 2);
      
        if (values.length % 2)
          return values[half];
      
        return ((values[half - 1] + values[half]) / 2.0).toFixed(3);
      }
    const resolution = () => {
        const threeJS = cookies.ThreeJS.resolution;
        const babylonJS = cookies.BabylonJS.resolution;
        if (threeJS.width === babylonJS.width && threeJS.height === babylonJS.height) {
            return threeJS;
        } else {
            return undefined;
        }
    }
    const exportPdf = () => {

        html2canvas(document.querySelector("#capture"), {scrollY: -window.scrollY}).then(canvas => {
            var imgData = canvas.toDataURL('image/JPG');
            var imgWidth = 210; 
            var pageHeight = 295;  
            var imgHeight = canvas.height * imgWidth / canvas.width;
            var heightLeft = imgHeight;
            var doc = new jsPDF('p', 'mm');
            var position = 0;

            doc.addImage(imgData, 'JPG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'JPG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            doc.save( 'results.pdf');
       });
   
    }
    console.log(cookies);
    return (
        <div>
            <AppBar position='static'>
                <Toolbar>
                    <Typography variant='h6' color='inherit' style={{flexGrow: 1}}>
                        Test results
                    </Typography>
                    <Button color="inherit" onClick={() => {history.push('/')}}>Home</Button>
                </Toolbar>
            </AppBar>
            <Container id='capture' maxWidth='md'>
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
                <Typography variant='h6' align='center' gutterBottom style={{margin: '36px 0'}}>
                    Benchmark results
                </Typography>
                <TableContainer>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {(deviceDetect().isMobile || deviceDetect().isTablet) &&
                                <>
                                    <TableCell>Operating System</TableCell>
                                    <TableCell>Vendor</TableCell>
                                    <TableCell>Model</TableCell>
                                </>
                                }
                                {(!deviceDetect().isMobile && !deviceDetect().isTablet) &&
                                <>
                                    <TableCell>Operating System</TableCell>
                                    <TableCell>Browser name</TableCell>
                                    <TableCell>Browser version</TableCell>
                                </>
                                }
                                <TableCell>Viewport resolution</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                {(deviceDetect().isMobile || deviceDetect().isTablet) &&
                                <>
                                    <TableCell>{deviceDetect().os} {deviceDetect().osVersion}</TableCell>
                                    <TableCell>{deviceDetect().vendor}</TableCell>
                                    <TableCell>{deviceDetect().model}</TableCell>
                                </>
                                }
                                {(!deviceDetect().isMobile && !deviceDetect().isTablet) &&
                                <>
                                    <TableCell>{deviceDetect().osName} {deviceDetect().osVersion}</TableCell>
                                    <TableCell>{deviceDetect().browserName}</TableCell>
                                    <TableCell>{deviceDetect().browserFullVersion}</TableCell>
                                </>
                                }
                                <TableCell>
                                    {resolution() && `${resolution().width}px x ${resolution().height}px`}
                                    {!resolution() && 'Undefined'}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Typography variant='h6' align='center' gutterBottom style={{margin: '36px 0'}}>
                    Scene loading time [ms]
                </Typography>
                <ResponsiveContainer width='100%' height={300}>
                    <BarChart
                        width={400}
                        height={300}
                        data={loadTime}
                        margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                        }}
                    >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Bar dataKey="threeJS" fill="#8884d8" />
                        <Bar dataKey="babylonJS" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
                <Typography variant='h6' align='center' gutterBottom style={{margin: '36px 0'}}>
                    Scene details
                </Typography>
                <TableContainer>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Geometries</TableCell>
                                <TableCell>Textures</TableCell>
                                <TableCell>Triangles</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{cookies.Info.geometries}</TableCell>
                                <TableCell>{cookies.Info.textures}</TableCell>
                                <TableCell>{cookies.Info.triangles}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Typography variant='h6' align='center' gutterBottom style={{margin: '36px 0'}}>
                    Frames per second during the test [frames / s]
                </Typography>
                <ResponsiveContainer width='100%' height={300}>
                    <LineChart
                        data={fpsTime}
                        margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="time"
                            name='Czas'
                            unit='s' 
                            ticks={fpsTime.filter((item, index) => {
                            return ((item.time % 0.5) === 0)
                        }).map(item => item.time)} />
                        <YAxis />
                        <Tooltip />
                        <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
                        <Line type="monotone" dataKey="threeJS" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="babylonJS" stroke="#82ca9d" />
                        {/* <Line type="monotone" dataKey="babylonJS" stroke="none" dot={{stroke: "#82ca9d"}} activeDot={{r: 8}} /> */}
                    </LineChart>
                </ResponsiveContainer>
                <TableContainer>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>ThreeJS</TableCell>
                                <TableCell>BabylonJS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>FPS average</TableCell>
                                <TableCell>{average(fpsTime.map(item => item.threeJS))}</TableCell>
                                <TableCell>{average(fpsTime.map(item => item.babylonJS))}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>FPS median</TableCell>
                                <TableCell>{median(fpsTime.map(item => {return item.threeJS}))}</TableCell>
                                <TableCell>{median(fpsTime.map(item => {return item.babylonJS}))}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>FPS maximum</TableCell>
                                <TableCell>{Math.max(...fpsTime.map(item => {return item.threeJS})).toFixed(3)}</TableCell>
                                <TableCell>{Math.max(...fpsTime.map(item => {return item.babylonJS})).toFixed(3)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>FPS minimum</TableCell>
                                <TableCell>{Math.min(...fpsTime.map(item => {return item.threeJS})).toFixed(3)}</TableCell>
                                <TableCell>{Math.min(...fpsTime.map(item => {return item.babylonJS})).toFixed(3)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
            <div style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                margin: '36px 0',
            }}>
                <Button variant="contained" color="primary" onClick={() => history.push('/three-js')}>
                    Repeat test
                </Button>
                <Button variant="contained" color="primary" onClick={() => exportPdf()}>
                    Download results to PDF
                </Button>
            </div>
        </div>
    );
};

export default ResultsPage;