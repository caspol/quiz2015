var path= require('path');

//Postgres DATABASE_URL= postgres://user:passwd@host:port/database
//SQLite DATABASE_URGL= sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;


//Cargar Modelo ORM
var Sequelize= require('sequelize');

//Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }
);


//Usar BBDD SQLite
//var sequelize= new Sequelize(null, null, null, {dialect: "sqlite", storage: "quiz.sqlite"});

//Importar la definicion de la tabla Quiz en quiz.js
var Quiz= sequelize.import(path.join(__dirname, 'quiz'));

//Exportar definicion de la tabla Quiz
exports.Quiz= Quiz;

//sequelize.sync() crea e inicializa tabla de preguntas en BD
//sequelize.sync().sucess(function(){
sequelize.sync().then(function(){

  //sucess(...) ejecuta el manejador una vez creada la tabla
  //Quiz.count().sucess(function(count){
  Quiz.count().then(function(count){

    if( count === 0){

      //La tabla se inicializa solo si esta vacia
      Quiz.create({ pregunta: 'Capital de Italia',
                    respuesta: 'Roma'});
      Quiz.create({ pregunta: 'Capital de Portugal',
                    respuesta: 'Lisboa'
      }).then(function(){ console.log('Base de datos inicializa')});
    };
  });
});
