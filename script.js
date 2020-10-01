window.onload=function(){
      
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10; //rayon de chaque balle
var j= 100;
var tabx=[j];
var taby=[j];
var tabdx=[j];
var tabdy=[j];
var tabv = [j];
var tot_tmp;
var temperature=1;
var kB= 1.38*Math.pow(10,-23); //constante de Bolzmann
var v=Math.sqrt((3*kB*temperature)/Math.pow(10,-22)); //calcul de v d'après la théorie cinétique 

//méthode pour initialiser les balles avec des positions et directions random
function initVals(){
  for(i=0;i<j;i++){
    tabx[i]=canvas.width-(Math.floor((Math.random() * (canvas.width-ballRadius*2)) + 1))-ballRadius-2;
    taby[i]=canvas.height-(Math.floor((Math.random() * (canvas.height-ballRadius*2)) + 1))-ballRadius-2;
    tabv[i]=v;
    tabdx[i]=Math.random()*2 - 1.0;
    tabdy[i]=Math.random()*2 - 1.0;
    tot_tmp=Math.sqrt(Math.pow(tabdx[i],2)+Math.pow(tabdy[i],2));
    //on modifie dx et dy de chaque balle pour que les balles se deplacent toujours à la même vitesse
    tabdx[i]=(v*tabdx[i])/tot_tmp;
    tabdy[i]=(v*tabdy[i])/tot_tmp;
  }
}

//méthode pour dessiner les balles
function drawBalls() {
  for(i=0;i<j;i++){
    ctx.beginPath();
    ctx.arc(tabx[i], taby[i], ballRadius, 0, 10);
    if(i==0){
    //on change de couleur à une balle pour ses deplacements
     ctx.fillStyle = "#ff0000";
    }else{
     ctx.fillStyle = "#0095DD";
    }
    ctx.fill();
    ctx.closePath();
  }
}

//méthode de detéction des collisions avec les parois
function collisionDetectionWall(){
  for(i=0;i<j;i++){
    if(tabx[i] + tabdx[i] > canvas.width-ballRadius || tabx[i] + tabdx[i] < ballRadius) {
      tabdx[i] = -tabdx[i];
    }
    if(taby[i] + tabdy[i] > canvas.height-ballRadius || taby[i] + tabdy[i] < ballRadius) {
      tabdy[i] = -tabdy[i];
    }
     if (taby[i] + ballRadius > canvas.height) {
        taby[i] = canvas.height - ballRadius;
    }
    if (taby[i] - ballRadius < 0) {
        taby[i] = ballRadius;
    }
     if (tabx[i] + ballRadius > canvas.width) {
        tabx[i] = canvas.width - ballRadius;
    }
    if (tabx[i] - ballRadius < 0) {
        tabx[i] = ballRadius;
    }

    tot_tmp=Math.sqrt(Math.pow(tabdx[i],2)+Math.pow(tabdy[i],2));
    tabv[i]=Math.sqrt((3*kB*temperature)/Math.pow(10,-22));
    
    if(tot_tmp!=0){   tabdx[i]=(tabv[i]* tabdx[i])/tot_tmp;
    tabdy[i]=(tabv[i]*tabdy[i])/tot_tmp;}

    tabx[i] += tabdx[i];
    taby[i] += tabdy[i];

  }
}

//méthode pour verifier les collisions entre les balles
function collisionDetectionBall(){ 
  var distance;
  for(i=0;i<j;i++){
    for(l=0;l<j;l++){
    var theta1 = Math.atan2(tabdy[i], tabdx[i]);
    var theta2 = Math.atan2(tabdy[l], tabdx[l]);
    var phi = Math.atan2(taby[l] - taby[i], tabx[l] - tabx[i]);
    var m = ballRadius * ballRadius * ballRadius;
    distance=Math.sqrt(Math.pow(tabx[i]-tabx[l],2) +Math.pow(taby[i]-taby[l],2));
      if (distance <= ballRadius*2 && l!=i){
      tabdx[i]= tabv[l]*Math.cos(theta2 - phi)* Math.cos(phi) + tabv[i]*Math.sin(theta1-phi) * Math.cos(phi+Math.PI/2);

      tabdy[i]= tabv[l]*Math.cos(theta2 - phi) * Math.cos(phi) + tabv[i]*Math.cos(theta1-phi) * Math.sin(phi+Math.PI/2);
      if(Math.round(tabdx[i])==Math.round(tabdx[l])) tabdx[i]*=-1;
            if(Math.round(tabdy[i])==Math.round(tabdy[l])) tabdy[i]*=-1;

      }
    }
  }
}

//méthode pour fixer les chévauchements
function hackOverlap() {
var distance;
  for(i=0;i<j;i++){
    for(l=0;l<j;l++){
      distance=Math.sqrt(Math.pow(tabx[i]-tabx[l],2) +Math.pow(taby[i]-taby[l],2))

      if (distance <= ballRadius*2 && l!=i){
                var theta = Math.atan2((taby[i] - taby[l]), (tabx[i] - tabx[l]));
                var overlap = ballRadius*2 - distance;
                tabx[l] -= overlap * Math.cos(theta);
                taby[l] -= overlap * Math.sin(theta);
            }
        }
    }
}

//méthode pour récuperer du slider le nombre de balles à afficher 
function sliderball(){
var x =document.getElementById("slider").value;
document.getElementById("nbBall").innerHTML = x;
j=x;
}

//méthode pour récuperer du slider la témperature 
function slidertemp(){
var x =document.getElementById("slidertemp").value;
document.getElementById("temperature").innerHTML = x;
temperature=x;

}

//méthode pour afficher le tout
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBalls();
  hackOverlap();
  if(temperature!=0){
  collisionDetectionBall();
  collisionDetectionWall();
  }
   sliderball();
   slidertemp();
}

initVals();
setInterval(draw, 10);

    }