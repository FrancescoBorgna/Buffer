
audioCtx = new AudioContext

// buffer = audioCtx.createBuffer(1, audioCtx.sampleRate*10, audioCtx.sampleRate)

// var period = 10;
// channelData = buffer.getChannelData(0)
// for(var i=0; i<channelData.length; i++){
//   channelData[i] = Math.sin(i/period); //così il periodo è 2*Math.Pi/audioCtx.sampleRate
// }
// bs = audioCtx.createBufferSource()
// bs.buffer = buffer;
// bs.connect(audioCtx.destination)

// BufferStart.onclick = function(){
//     audioCtx.resume()
//     bs.start()
// }


//  //second part
// var sp = audioCtx.createScriptProcessor(4096,1,1)

// // Give the node a function to process audio events
// sp.onaudioprocess = function(audioProcessingEvent) {
//   // The input buffer is the song we loaded earlier
//   var inputBuffer = audioProcessingEvent.inputBuffer;
//   // The output buffer contains the samples that will be modified and played
//   var outputBuffer = audioProcessingEvent.outputBuffer;

//   // Loop through the output channels (in this case there is only one)
//   for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
//     var inputData = inputBuffer.getChannelData(channel);
//     var outputData = outputBuffer.getChannelData(channel);

//     // Loop through the 4096 samples
//     for (var sample = 0; sample < inputBuffer.length; sample++) {
//       // make output equal to the same as the input
//       outputData[sample] = inputData[sample];         
//     }
//   }
// }

// o = audioCtx.createOscillator();
// o.connect(sp);
// sp.connect(audioCtx.destination)


// BufferStart.onclick = function(){
//   audioCtx.resume()
//   o.start()
// }
// // THird part
var t_sec = 5;
var audioData = new Float32Array(audioCtx.sampleRate*t_sec)
var audioIndex= 0;

function record(data){
  for(var i=0; i<data.length;i++){
    if(audioIndex < audioData.length)
    audioData[audioIndex++] = data[i]
  }
}
// var sp = audioCtx.createScriptProcessor(4096,1,1)
// sp.onaudioprocess = function(e){
//   var inputBuffer = e.inputBuffer;
//   var outputBuffer = e.ouputBuffer;
  
//   var inputData = inputBuffer.getChannelData(0);
//   var outputData = outputBuffer.getChannelData(0);
  
//   for(var i = 0; i < inputData.length; i++){
//     outputData[i] = inputData[i];
//   }
//   record(inputData); // mette in audiodata input data
// }
var sp = audioCtx.createScriptProcessor(4096,1,1)

// Give the node a function to process audio events
sp.onaudioprocess = function(audioProcessingEvent) {
  // The input buffer is the song we loaded earlier
  var inputBuffer = audioProcessingEvent.inputBuffer;
  // The output buffer contains the samples that will be modified and played
  var outputBuffer = audioProcessingEvent.outputBuffer;

  // Loop through the output channels (in this case there is only one)
  for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
    var inputData = inputBuffer.getChannelData(channel);
    var outputData = outputBuffer.getChannelData(channel);

    // Loop through the 4096 samples
    for (var sample = 0; sample < inputBuffer.length; sample++) {
      // make output equal to the same as the input
      outputData[sample] = inputData[sample];         
    }
    record(inputData); // mette in audiodata input data
  }
}

// // Version 1
// function playBuffer(data) {
//     b = c.createBuffer(1, data.length, c.sampleRate);
//     d = b.getChannelData(0);
//     for(var i = 0; i <data.length; i++){
//       d[i] = data[i];
//     }
    
//     bs = c.createBufferSource();
//     bs.buffer = b;
//     bs.connect(c.destination);
//     bs.start();
// }

//ms = await navigator.mediaDevices.getUserMedia({audio:true})
var ms;
navigator.mediaDevices.getUserMedia({audio:true})
.then(function(mediaStream) {
  console.log("Mic ready!")
  ms = mediaStream;
  // var mss = audioCtx.createMediaStreamSource(mediaStream) //crea stream che da microfono mi collega la programma
  // mss.connect(sp)
})
.catch(function(err) { console.log("Not available microphones"); 
}); // always check for errors at the end.

var mss = audioCtx.createMediaStreamSource(ms) //crea stream che da microfono mi collega la programma
mss.connect(sp)



// playBuffer(audioData) for version 1

function playBuffer(data) {
  b = audioCtx.createBuffer(1, data.length, audioCtx.sampleRate);
  d = b.getChannelData(0);
 for(var i = 0; i <data.length; i++){
   d[i] = data[i];
 }
 bs = audioCtx.createBufferSource();
 bs.buffer = b;
 bs.connect(audioCtx.destination);
 return bs;
}

playBufferBut = document.getElementById("playBufferBut")
playBufferBut.onclick = function() {
  audioCtx.resume()
  console.log("Playing buffer")
  bs = playBuffer(audioData);
  bs.start()
}
resetAudioIndex = document.getElementById("resetAudioIndex")
resetAudioIndex.onclick = function() {
  console.log("AudioIndex resetted")
  audioCtx.resume()
  audioIndex = 0;
}
// bs = playBuffer(audioData)
// bs.start()

// bs.stop()
// bs.loop = true
// bs.start()

// bs.loopStart = 2;
// bs.loopEnd = 3;