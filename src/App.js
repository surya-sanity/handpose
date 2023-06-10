import './App.css';
import * as tf from "@tensorflow/tfjs"
import * as handpose from "@tensorflow-models/handpose"
import Webcam from 'react-webcam';
import { useEffect, useRef } from 'react';
import { drawHand } from './helper';

function App() {
  const webCamRef = useRef(null)
  const canvasRef = useRef(null)

  const runHandPose = async () => {
    const net = await handpose.load();
    console.log('handpose model loaded !')
    return net;
  }
  const detectHand = async (net) => {
    if (typeof webCamRef.current !== 'undefined' && webCamRef.current !== null && webCamRef.current.video.readyState === 4) {
      const video = webCamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      webCamRef.current.video.width = videoWidth;
      webCamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;


      const hand = await net.estimateHands(video);
      console.log("hand", hand);

      const ctx = canvasRef.current.getContext('2d');
      drawHand(hand, ctx);
    }
  }

  useEffect(() => {
    let interval;
    runHandPose().then((net) => {
      interval = setInterval(() => {
        detectHand(net);
      }, 100)
    })
    return () => clearInterval(interval);
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <Webcam ref={webCamRef}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 9,
            width: 640,
            height: 480
          }}
        />
        <canvas ref={canvasRef}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 9,
            width: 640,
            height: 480
          }}
        />
      </header>
    </div>
  );
}

export default App;
