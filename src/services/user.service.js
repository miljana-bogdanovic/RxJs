
const jsonServer = require('json-server');
const server = jsonServer.create();
const _ = require('lodash')
const router = jsonServer.router('../../database.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;
    
server.use(middlewares);
server.use(jsonServer.bodyParser)

    
export const addPlayer= async (name) => {
    server.post('/players', (req, res) => {
        console.log(req)
    const db = router.db; // Assign the lowdb instance
    
    // if (Array.isArray(req.body)) {
    //     req.body.forEach(element => {
    //         insert(db, 'players', element); // Add a post
    //     });
    // }
    // else {
        insert(db, 'players', req.body); // Add a post
    //}
    res.sendStatus(200);

    function insert(db, collection, data) {
        const table = db.get(collection);
        if (_.isEmpty(table.find(data).value())) {
            table.push(data).write();
        }
    }
});

}


// export const getPlayers = async () => {
//     const response = await fetch('/players');
//     const myJson = await response.json(); //extract JSON from the http response
//    console.log(myJson)
//   }


server.use(router);
server.listen(port);

