function randomColor(){
    var c=Math.floor(Math.random()*256)
    while(c==0||c>255){
      c=Math.floor(Math.random()*256)
    }
    return c
  }
  //十六进制颜色随机
  export function color16(){
    var r = randomColor();
    var g = randomColor();
    var b = randomColor();
    var color = '#'+r.toString(16)+g.toString(16)+b.toString(16);
    return color;
  }