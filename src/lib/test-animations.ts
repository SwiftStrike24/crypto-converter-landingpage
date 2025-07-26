// Test file to validate animation system
import { detectPerformance, createFPSCounter } from './animations';

export const testAnimationSystem = () => {
  console.log('=== Animation System Test ===');
  
  // Test performance detection
  const isHighPerf = detectPerformance();
  console.log(`Performance Mode: ${isHighPerf ? 'HIGH' : 'LOW'}`);
  console.log(`Device Memory: ${(navigator as any).deviceMemory || 'Unknown'}GB`);
  console.log(`Screen Size: ${window.innerWidth}x${window.innerHeight}`);
  console.log(`User Agent: ${navigator.userAgent.substring(0, 50)}...`);
  
  // Test FPS counter
  const fpsCounter = createFPSCounter();
  let frameCount = 0;
  
  const testFPS = () => {
    fpsCounter.update();
    frameCount++;
    
    if (frameCount % 60 === 0) {
      console.log(`FPS: ${fpsCounter.getFPS()}`);
    }
    
    if (frameCount < 300) {
      requestAnimationFrame(testFPS);
    } else {
      console.log('=== Test Complete ===');
    }
  };
  
  console.log('Starting FPS test...');
  requestAnimationFrame(testFPS);
};