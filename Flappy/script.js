const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const img = new Image();
img.src = './media/flappy-bird-set.png';

// General settings 
let gamePlaying = false;
const gravity = .5;
const speed = 6.2; 
const size = [51, 36];
const jump = -11.5;
const cTenth = (canvas.width / 10);


// Pipe settings
const pipeWidth = 78;
const pipeGap = 270;
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;


// Variables 
let index = 0;
let bestScore = 0;
let currentScore = 0;
let pipes = [];
let flight = 0;                                     // Bird Y position calculated based on jump (click) minus gravity
let flyHeight = (canvas.height /2) - (size[1] / 2); // Center so -> canvas size / 2 - bird size / 2 ----> Will then be calculated based on 'flight'




const setup = () => {
    currentScore = 0;
    flight = jump;
    flyHeight = (canvas.height / 2) - (size[1] / 2);

    pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]); // canvas.width + (i * (pipeGap + pipeWidth)) = X        pipeLoc for Y

    console.log(pipes);
}




const render = () => {
    index++;

    // Draw background (use of 2 canvas to have a superposition and avoid to see the entire image move to the left )
    ctx.drawImage(
        img, 
        0, 
        0, 
        canvas.width, 
        canvas.height, 
        -((index * (speed / 2)) % canvas.width) + canvas.width,     // Scrolling to left 
        0,
        canvas.width,
        canvas.height
    );

    ctx.drawImage(
        img, 
        0, 
        0, 
        canvas.width, 
        canvas.height, 
        -((index * (speed / 2)) % canvas.width),                    // Scrolling to left (in the second we don't add the canvas.width -> meaning that when the first image is on the left, the second one arrive in to right)
        0,
        canvas.width,
        canvas.height
    );



    if(gamePlaying){

        // Draw Bird
        ctx.drawImage(
            img,                                        // Source image
            433,                                        // Starting X in source image
            Math.floor((index % 9) / 3) * size[1],      // Starting Y in source image 
            ...size,                                    // Size in source (here size is an array so this parameter represent the input parameters 4 and 5)
            cTenth,                                     // Starting X in target canvas -> 1/10 of the canvas width
            flyHeight,                                  // Starting Y in target canvas 
            ...size                                     // Size in target canvas (here size is an array so this parameter represent the input parameters 8 and 9)                                       
        );

        flight += gravity;
        flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]); // Math.Min is there to avoid that the bird continue to fall under the ground
    
    }else{

        // Draw Bird
        ctx.drawImage(
            img,                                        // Source image
            433,                                        // Starting X in source image
            Math.floor((index % 9) / 3) * size[1],      // Starting Y in source image 
            ...size,                                    // Size in source (here size is an array so this parameter represent the input parameters 4 and 5)
            ((canvas.width / 2) - (size[0] / 2)),       // Starting X in target canvas -> Center so -> canvas size / 2 - bird size / 2
            flyHeight,                                  // Starting Y in target canvas 
            ...size                                     // Size in target canvas (here size is an array so this parameter represent the input parameters 8 and 9)                                       
        );


        // Draw start screen 
        ctx.font = "bold 30px courier";
        ctx.fillText(`Meilleur score: ${bestScore}`, 55, 245);
        ctx.fillText('Cliquez pour jouer', 48, 535);
    }



    // Draw pipes
    if(gamePlaying){
        pipes.map(pipe => {
            pipe[0] -= speed;       // Then the pipe will move to the left

            // Top Pipe 
            ctx.drawImage(
                img, 
                432,
                588 - pipe[1], 
                pipeWidth,
                pipe[1],
                pipe[0], 
                0,
                pipeWidth,
                pipe[1]
            );

            // Bottom pipe
            ctx.drawImage(
                img, 
                432 + pipeWidth,
                108, 
                pipeWidth,
                canvas.height - pipe[1] + pipeGap, // + pipeGap to avoid to have the pipe just under the top pipe
                pipe[0], 
                pipe[1] + pipeGap,
                pipeWidth,
                canvas.height - pipe[1] + pipeGap
            );


            if(pipe[0] <= -pipeWidth){ // if pipe out of canvas
                currentScore ++;
                bestScore = Math.max(bestScore, currentScore);

                // Remove pipe and add a new one
                pipes = [...pipes.slice(1), [pipes[pipes.length-1][0] + pipeGap + pipeWidth, pipeLoc()]]; // To add a new element, we get the X position of the last in the Array and then add the gap + width -> then the loc 
            }


            // Collision detection with bird
            if([
                pipe[0] <= cTenth + size[0],                                       // Bird is potentialy touching pipe since the Bird is always at CTenth ! 
                pipe[0] + pipeWidth >= cTenth,                                     // Pipe is not behind the bird 
                pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]     // Check that bird is not in the gap between top pipe and bottom pipe 
            ].every(elem => elem)){
                gamePlaying = false;
                setup();
            }
        });
    }

    document.getElementById('bestScore').innerHTML = `Meilleur : ${bestScore}`;
    document.getElementById('currentScore').innerHTML = `Actuel : ${currentScore}`;

    requestAnimationFrame(render);
}

setup();
img.onload = render;
document.addEventListener('click', () => gamePlaying = true );
onclick = () => flight = jump;
