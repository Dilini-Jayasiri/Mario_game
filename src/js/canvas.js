//import all the images from assets folder
import platform from '../assets/platform.png';
import hills from '../assets/hills.png';
import background from '../assets/background.png';
import platformSmallTall from '../assets/platformSmallTall.png';
import spriteRunLeft from '../assets/spriteRunLeft.png';
import spriteRunRight from '../assets/spriteRunRight.png';
import spriteStandLeft from '../assets/spriteStandLeft.png';
import spriteStandRight from '../assets/spriteStandRight.png';



const canvas=document.querySelector('canvas');

const c =canvas.getContext('2d');

canvas.width=1024;
canvas.height=576;

const gravity=1.5;

class Player{
  constructor(){
  //initial state for player
    this.speed = 10;
    this.position={
      x:100,
      y:100
    }
    this.velosity={
      x:0,
      y:1
    }
    this.width=66;
    this.height=150;
    this.image = createImage(spriteStandRight);
    this.frames=0;
    this.sprites={
      stand:{
        right:createImage(spriteStandRight),
        left:createImage(spriteStandLeft),

        cropWidth:177,
        width:66
    },
    run: {
      right:createImage(spriteRunRight),
      left:createImage(spriteRunLeft),
      cropWidth:341,
      width:127.875
  }
}
this.currentSprite = this.sprites.stand.right
this.currentCropWidth = 177;

}

  draw(){
    c.drawImage( this.currentSprite,this.currentCropWidth * this.frames,0,this.currentCropWidth,400,this.position.x,this.position.y,this.width,this.height)
  }
  update(){
    this.frames++
    if(this.frames>59 && (this.currentSprite===this.sprites.stand.right || this.currentSprite===this.sprites.stand.left)) {
      this.frames=0;
    }else if
      (this.frames>29 && (this.currentSprite===this.sprites.run.right || this.currentSprite===this.sprites.run.left)){
        this.frames=0;
      }
    
    this.draw();
    this.position.y+=this.velosity.y;
    this.position.x+=this.velosity.x;

    if(this.position.y+this.height+this.velosity.y<=canvas.height){
      this.velosity.y+=gravity;
    }

    
  }
}

class Platform{
  constructor({x,y,image}){
    this.position={
      x,
      y
      }  
    this.image=image;
    this.width=image.width;
    this.height=image.height;
   
  }
  draw(){
    c.drawImage( this.image,this.position.x,this.position.y)
  }
}


//for other images
class GenericObject{
  constructor({x,y,image}){
    this.position={
      x,
      y
      }  
    this.image=image;
    this.width=image.width;
    this.height=image.height;
   
  }
  draw(){
    c.drawImage( this.image,this.position.x,this.position.y)
  }
}

function createImage(imageSrc){
  const image=new Image();
  image.src=imageSrc;
  return image
}

let platformImage = createImage(platform);
let platformSmallTallImage = createImage(platformSmallTall);
let lastKey;

let player=new Player()
let platforms = [];
let genericObjects=[];

const keys = {
  right:{
    pressed:false
  },
  left:{
    pressed:false
  }
}

let scrollOffset = 0;

function init(){
 platformImage = createImage(platform);

 player=new Player()
 platforms = [new Platform({x:platformImage.width * 4 + 300 - 2+platformImage.width - platformSmallTallImage.width,y:270,image:createImage(platformSmallTall)}),
              new Platform({x:-1,y:470,image:platformImage}),
              new Platform({x:platformImage.width-3,y:470,image:platformImage}),
              new Platform({x:platformImage.width * 2 + 100,y:470,image:platformImage}),
              new Platform({x:platformImage.width * 3 + 300,y:470,image:platformImage}),
              new Platform({x:platformImage.width * 4 + 300 - 2,y:470,image:platformImage}),
              new Platform({x:platformImage.width * 5 + 700 - 2,y:470,image:platformImage})]


 genericObjects=[new GenericObject({
    x:-1,
    y:-1,
    image:createImage(background)
  }),
  new GenericObject({
    x:-1,
    y:-1,
    image:createImage(hills)
  }),
]

 scrollOffset = 0;
}

function animate(){
  requestAnimationFrame(animate);
  c.fillStyle='white';
  c.fillRect(0,0,canvas.width,canvas.height);

  genericObjects.forEach(genericObject =>{
    genericObject.draw();
  })
  
  platforms.forEach((platform)=>{
    platform.draw();
  })
  player.update()
  
  if(keys.right.pressed && player.position.x < 400){
    player.velosity.x=player.speed;
  }else if((keys.left.pressed && player.position.x>100) || keys.left.pressed && scrollOffset===0 && player.position.x>0){
    player.velosity.x=-player.speed;
  }
  else{
    player.velosity.x=0;

    //platform movement
    if(keys.right.pressed){
      scrollOffset+=player.speed;
      platforms.forEach((platform)=>{
      platform.position.x-=player.speed;;
    })
      genericObjects.forEach((genericObject)=>{
        genericObject.position.x-= player.speed * 0.66;
      })
    }else if(keys.left.pressed && scrollOffset>0){
      scrollOffset-=player.speed;;
      platforms.forEach((platform)=>{
      platform.position.x+=player.speed;;
    })
      genericObjects.forEach((genericObject)=>{
        genericObject.position.x+=player.speed*0.66
      })
    }
  }


//platform collision detection
platforms.forEach((platform)=>{

  if(player.position.y+player.height<=platform.position.y && player.position.y+player.height+player.velosity.y>=platform.position.y && player.position.x+player.width>=platform.position.x && player.position.x<=platform.position.x+platform.width){
    player.velosity.y=0
  }
})

//sprite switching
if(
  keys.right.pressed && 
  lastKey==='right' &&
  player.currentSprite!==player.sprites.run.right){
  player.frames=1;

      player.currentSprite=player.sprites.run.right;
      player.currentCropWidth = player.sprites.run.cropWidth;
      player.width = player.sprites.run.width;

}else if( 
  keys.left.pressed && 
  lastKey==='left' && player.currentSprite!==player.sprites.run.left){
  player.currentSprite = player.sprites.run.left;
  player.currentCropWidth = player.sprites.run.cropWidth;
  player.width = player.sprites.run.width;
}

//stop running 
else if( 
  !keys.left.pressed && 
  lastKey==='left' && 
  player.currentSprite!==player.sprites.stand.left){
  player.currentSprite = player.sprites.stand.left;
  player.currentCropWidth = player.sprites.stand.cropWidth;
  player.width = player.sprites.stand.width;
}

else if( 
  !keys.right.pressed && 
  lastKey==='right' && 
  player.currentSprite!==player.sprites.stand.right){
  player.currentSprite = player.sprites.stand.right
  player.currentCropWidth = player.sprites.stand.cropWidth
  player.width = player.sprites.stand.width
}



//win condition
if(scrollOffset>platformImage.width * 5 + 300 - 2){
  console.log('you win');
}

//lose condition
if(player.position.y>canvas.height){
   init();
  //console.log('You lose');
}
}

init();
animate();

addEventListener('keydown', ({keyCode}) =>{
  //console.log(keyCode)
  switch (keyCode){
    case 38:
      console.log('up')
      player.velosity.y-=10
      break

      case 40:
      console.log('down')
      break

      case 39:
      console.log('right')
      //keys is object
      keys.right.pressed=true
      lastKey='right'
      break
     
      break

      case 37:
      console.log('left')
      keys.left.pressed=true
      lastKey='left';

      break
  }
  console.log(keys.right.pressed)
})

addEventListener('keyup', ({keyCode}) =>{
  //console.log(keyCode)
  switch (keyCode){
    case 38:
      console.log('up')
      player.velosity.y-=30
      break

      case 40:
      console.log('down')
      break

      case 39:
      console.log('right')
      keys.right.pressed=false
      
      break

      case 37:
      console.log('left')
       keys.left.pressed=false
      player.currentSprite = player.sprites.run.left
      player.currentCropWidth = player.sprites.run.cropWidth
      player.width = player.sprites.run.width
      break
  }
  console.log(keys.right.pressed)
})

