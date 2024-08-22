document.addEventListener("DOMContentLoaded", () => {
    const videoMain = document.querySelector("#videoMain");
    const canvasMain = document.querySelector("#canvasMain");
    const pictureBtn = document.querySelector("#take-picture");
    const showVideoBtn = document.querySelector("#show-video");
    const image = document.querySelector("#photo");
    const predictionText = document.querySelector("#prediction-text");
    const changeCamera = document.querySelector("#change-camera");

    let camera = "user";

    const classifier = ml5.imageClassifier("MobileNet");

    changeCamera.addEventListener("change-camera", () => {
        try{
            if (camera === "user") {
                camera = "environment";
            }else if (camera === "environment") {
                camera = "user";
            }
        }catch(e){
            console.error(e);
        }
        
    });

    //enviroment - rear , user - front camera
    const constaints = {
        video: { facingMode: camera  },
        audio: false
    }

    navigator.mediaDevices.getUserMedia(constaints)
        .then(steam => {
             videoMain.srcObject = steam;
             videoMain.play();
        })
        .catch(err => {
            console.error("Error getting user media", err);
        })    

    pictureBtn.addEventListener('click', () => {
        canvasMain.width = videoMain.videoWidth;
        canvasMain.height = videoMain.videoHeight;
        // Draw the current frame from the video onto the canvas
        const context = canvasMain.getContext('2d');
        context.drawImage(videoMain, 0, 0, canvasMain.width, canvasMain.height);
        
        // Convert the canvas content to a data URL (base64 string)
        const dataURL = canvasMain.toDataURL('image/png');
        
        // Set the img element source to the captured photo
        image.src = dataURL;

        showImg();
        classifier.classify(image, gotResult);
        
    });

    function showImg() {
        // Update video and img
        videoMain.style.visibility = 'hidden';
        videoMain.style.display = 'none';
        image.style.visibility = 'visible';
        image.style.display = 'block';

        showVideoBtn.disabled = false;
    }

    function gotResult(result){
        console.log(result);
        try{
            if (result.length > 0) {
                predictionText.innerText = `Prediction: ${result[0].label}`
                predictionText.classList.add('text-animate');
            }
        }catch(e){
            console.error(e);
            predictionText.innerText = `Cant't find prediction`
            predictionText.classList.add('text-animate');
        }
        
    }

    showVideoBtn.addEventListener('click', () => {
        videoMain.style.visibility = 'visible';
        videoMain.style.display = 'block';
        image.style.visibility = 'hidden';
        image.style.display = 'none';

        predictionText.innerText = ``
        predictionText.classList.remove('text-animate');

        showVideoBtn.disabled = true;
    });

});