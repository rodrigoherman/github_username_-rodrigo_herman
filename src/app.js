// Imports needed modules
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const UsuariosGit = require('./utils/usuarioGit')
const fs = require('fs');
const nomeArquivo = 'usuarios.json';

// Creates app
const app = express();

// Adds json parsing middleware
app.use(express.json());

// Initializes application port
const port = process.env.PORT || 3000;

// Define paths for Express config
const viewsPath = path.join(__dirname,'./templates/views');
const partialsPath = path.join(__dirname, './templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(path.join(__dirname, '../public')));

// Creates base URL route "/" and renders index view
app.get('', (req,res) => {
    res.render('index', {
        title: 'Usuários do GITHUB',
    })

})

app.get('/index', (req,res) => {
    res.render('index', {
        title: 'Usuários do GITHUB',
    })

})

app.get('/historico', (req,res) => {
    res.render('historico', {
        title: 'Usuários do GITHUB',
    })
})

// Creates send-sms endpoint
app.post('/buscausuarios', async (req, res) => {
    const { 
        yourName
    } = req.body

    if (!yourName) {
        console.log(yourName + " não encontrado")

        return res.status(404).send({
            message: "Informe o username para consultar"
        })
    }
    else {

        try {
            const compatibility = await UsuariosGit.getUsuario(yourName)

            const heading = compatibility.data.heading;

            gravarUsuario(req, res);
            
            console.log('login: ' + compatibility.data.login);

            return res.json({
                heading,
                message: compatibility.data.name + ' - ' + compatibility.data.html_url + ' - ' + compatibility.data.bio
            })        

        } catch(e) {

            return res.status(500).json({
                message: "Usuário não encontrado!"
            })
        }
    }
})


// lista de usuários pesquisados
app.get('/lerusuarios', function(req, res){
    fs.readFile(nomeArquivo, 'utf8', function(err, data){
      if (err) {
        var response = {status: 'falha', resultado: err};
        res.json(response);
      } 
      else 
      {
        var obj = JSON.parse(data);
        var result = 'Nenhum usuário foi encontrado';
        var nomeUsuario = req.query.nomeUsuario;

        if (nomeUsuario != null)
        {

            obj.usuarios.forEach(function(usuario) {
                console.log(usuario);
                if (usuario != null) {
                    if (usuario.nomeUsuario == req.query.nomeUsuario) {
                        //result = usuario;
                        result = {resultado: usuario};
                    }
                }
            });
        }
        else
        {
            result = JSON.stringify(obj);
        }
    
        //var response = {status: 'sucesso', resultado: result};
        //res.json(response);
        res.json(result)
      }
    });
   });

// gravação de usuários
app.post('/gravarusuario', function(req, res){
    gravarUsuario(req, res);
});

function gravarUsuario(req, res)
{
    fs.readFile(nomeArquivo, 'utf8', function(err, data){
        if (err) {
            var response = {status: 'falha', resultado: err};
            res.json(response);
        } else {
            var obj = JSON.parse(data);

            obj.usuarios.push(req.body);

            fs.writeFile(nomeArquivo, JSON.stringify(obj), function(err) {
                if (err) {
                var response = {status: 'falha', resultado: err};
                res.json(response);
                } else {
                var response = {status: 'sucesso', resultado: 'Registro incluso com sucesso'};
                res.json(response);
                }
            });
        }
    });
}


// Catch all route, renders 404 page
app.get('*', (req, res) => {
    res.render('404',
        {
            search: 'page'
        }
    )
})

// Directs app to listen on port specified previously
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})