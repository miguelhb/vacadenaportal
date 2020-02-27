// index.js
var bcvacasdk = require('./bcvacasdk/lib/index.js');

const path = require("path");
const express = require("express");
const bodyParser =require('body-parser');

const app = express();
const port = process.env.PORT || "8000";

moment = require('moment');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));
var token;

app.get("/", (req, res) => {
  //res.status(200).send("WHATABYTE: Food For Devs");
  res.render("index", { title: "Home" });
});

app.post("/login", async (req, res) => {
  try{
      console.log('Initializing BCVacaSDK');
      var host ='https://app.swaggerhub.com/apis/dsanchezderivera/BCVacaAPI/0.0.1-oas3';
      var user = 'plexususer@plexus.com';
      var pass = 'plexusAPI';
      console.log("Usuario: "+ req.body.usuario);
      console.log("Contraseña "+ req.body.contraseña);
       bcvacasdk.configure('https://bcvacaapi.gisai.geoide.upm.es', req.body.usuario, req.body.contraseña);
      //console.log("Result: " +result);


       console.log("Retrieving token");
       token = await bcvacasdk.token.login();
       //const token = await bcvacasdk.token.login();
       //localStorage.setItem("token", token);
       if(!token){
         res.render("index", {title: "Home"});
       }else{
         console.log("Token: "+token);
         res.render("login", { title: "Home" });
       }
     }catch{
       console.log("**Excepcion en login**");
       if(error){
         console.log(error);
       }
     }
});

app.post("/insertar", async (req, res) => {
  try{
      var data = {
      	"animales": [
      		req.body.animales
      	],
      	"identificadorLoteDes": req.body.idLote,
      	"identificadorDespiece": req.body.idDespiece,
      	"identificadorNegocio": req.body.idNegocio,
      	"tipoNegocio": req.body.tipNegocio,
      	"tipoMovimiento": req.body.tipMovimiento,
      	"usuario": req.body.usuario,
      	"fecha":  moment().format().toString()
      }
      console.log(data);
      var result = await bcvacasdk.movements.putMovement(data);
      console.log("Result: "+result);
      res.render("login.pug", {resultR: result})
  }catch(error){
    console.log("**Excepcion al insertar**");
    console.log(error);
  }
});

app.post("/consultar", async (req, res) => {
  try{
  //  console.log("Token: "+ token);
    console.log("Primer parametro: "+ req.body.idNe);
    console.log("Segundo parametro: "+ req.body.tipNe);
    const data = {
      'identificadorNegocio': req.body.idNe,
      'tiposNegocio': req.body.tipNe ? req.body.tipNe : undefined,
      'identificadorAnimal': req.body.idAn ? req.body.idAn : undefined,
      'identificadorLoteDes':req.body.idLoDe ? req.body.idLoDe : undefined,
      'identificadorDespiece': req.body.idDe ? req.body.idDe : undefined,
      'maxResultados': req.body.maxRes ? parseInt(req.body.maxRes, 10) : undefined
    };
    console.log(data);
    var movement = await bcvacasdk.movements.getMovements(data);
    console.log(movement);
    res.render("login.pug", { resultC: movement });
  }catch{
    console.log("**Excepcion en consultar**");
    console.log(error);

  }
});

app.get("/user", (req, res) => {
  res.render("user", { title: "Profile", userProfile: { nickname: "Auth0" } });
});

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});


var test = async function (){
  console.log('Initializing BCVacaSDK');
  var host ='https://app.swaggerhub.com/apis/dsanchezderivera/BCVacaAPI/0.0.1-oas3';
  var user = 'plexususer@plexus.com';
  var pass = 'plexusAPI';
  bcvacasdk.configure(host, user, pass);

  // console.log("Retrieving token");
  // var token = await bcvacasdk.token.login();
  // console.log("Token: "+token);

  const data = {
    'identificadorNegocio': 'abcd3',
    'tipoNegocio': 1
  };
  var movement = await bcvacasdk.movements.getMovements(data);
  console.log('Data: '+movement);
  return movement;//req.query);

};
