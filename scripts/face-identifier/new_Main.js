class Webcam {
  constructor(webcamElement) {
    this.webcamElement = webcamElement;
    this.captured_num = 0;
  }
  capture() {
    return tf.tidy(() => {
      const webcamImage = tf.fromPixels(this.webcamElement);
      const croppedImage = this.cropImage(webcamImage);
      // Expand the outer most dimension so we have a batch size of 1.
      const batchedImage = croppedImage.expandDims(0);
      // Normalize the image between -1 and 1. The image comes in between 0-255,
      // so we divide by 127 and subtract 1.
      return batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
    });
  }
  adjustVideoSize(width, height) {
    const aspectRatio = width / height;
    if (width >= height) {
      this.webcamElement.width = aspectRatio * this.webcamElement.height;
    } else if (width < height) {
      this.webcamElement.height = this.webcamElement.width / aspectRatio;
    }
  }
  cropImage(img) {
    const size = Math.min(img.shape[0], img.shape[1]);
    const centerHeight = img.shape[0] / 2;
    const beginHeight = centerHeight - (size / 2);
    const centerWidth = img.shape[1] / 2;
    const beginWidth = centerWidth - (size / 2);
    return img.slice([beginHeight, beginWidth, 0], [size, size, 3]);
  }
  snapshot(canvas, origin_this) {
    if (origin_this.captured_num == 10) {
      clearInterval(window.interval_id);
    } else {
      origin_this.captured_num++;
      var context = canvas.getContext('2d');
      context.drawImage(origin_this.webcamElement, 0, 0, canvas.width, canvas.height);
    }
  }
  auto_snap(canvas) {
    var origin_this = this;
    window.interval_id = setInterval(this.snapshot, 1000, canvas, origin_this);//set to be gloabl variable for stop interval coveniently.
  }

  async setup() {
    return new Promise((resolve, reject) => {
      const navigatorAny = navigator;
      navigator.getUserMedia = navigator.getUserMedia ||
          navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
          navigatorAny.msGetUserMedia;
      if (navigator.getUserMedia) {
        navigator.getUserMedia(
            {video: true},
            stream => {
              this.webcamElement.srcObject = stream;
              this.webcamElement.addEventListener('loadeddata', async () => {
                this.adjustVideoSize(
                    this.webcamElement.videoWidth,
                    this.webcamElement.videoHeight);
                resolve();
              }, false);
            },
            error => {
              reject();
            });
      } else {
        reject();
      }
    });
  }
}

async function init() {
  try {
    await webcam.setup();
  } catch(e) {
    document.getElementById('no_webcam').innerHTML = 'No web cam';
  }
}

webcam = new Webcam(document.getElementById('player'));
var Try_button = document.getElementById('Try');
Try_button.addEventListener('click', init);
var capture_button = document.getElementById('snapshot');
capture_button.addEventListener('click', function () {webcam.auto_snap(document.getElementById('canvas'))});
