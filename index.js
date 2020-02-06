const mysql = require('mysql')
const express = require('express')
var app = express()
const bodyparser = require('body-parser')
app.use(bodyparser.json())

var mysqlConnection = mysql.createConnection({
    host:'35.247.250.82',
    user:'root',
    password:'Crud',
    database:'db_CrudNodeJs',
    port:3306,
    multipleStatements:true
})

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});


app.listen(3000, () => console.log('Express server is running at port no: 3000'))

// Fazendo Select no banco de Dados
app.get('/usuarios',(req, res) => {
    mysqlConnection.query('SELECT * FROM  tbl_Usuario', (err, rows, fields) =>{
        if (!err)
        res.send(rows)
        else
        console.log(err)
    })
})

//Fazendo Select no banco de Dados por ID
app.get('/usuarios/:id', (req, res) =>{
    mysqlConnection.query('SELECT * FROM tbl_Usuario WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Apagando item do banco de Dados por ID
app.delete('/usuarios/:id', (req, res) =>{
    mysqlConnection.query('Delete FROM tbl_Usuario WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Usuário apagado com sucesso');
        else
            console.log(err);
    })
});

//Inserindo novos usuarios
app.post('/usuarios', (req, res) => {
    let slctBody = req.body;
    //var sql = "SET @usuario = ?;SET @senha = ?; CALL tbl_UsuarioAddOrEdit(@usuario,@senha);";
    var sql = "insert into tbl_Usuario(SET @usuario = ?;SET @senha = ?;) values(@usuario,@senha);"
    mysqlConnection.query(sql, [slctBody.usuario, slctBody.senha], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Usuario inserido com sucesso');
            });
        else
            console.log(err);
    })
});

//Update Usuario
app.put('/usuarios', (req, res) => {
    let upBody = req.body;
    var sql = "SET @id = ?;SET @usuario = ?;SET @senha = ?; \
    CALL tbl_UsuarioAddOrEdit(@id,@usuario,@senha);";
    mysqlConnection.query(sql, [upBody.id, upBody.usuario, upBody.senha], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully');
        else
            console.log(err);
    })
});