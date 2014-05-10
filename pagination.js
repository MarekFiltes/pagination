var http = require("http");
var port = Number(process.env.PORT || 5000);

http.createServer(function (req, res) {
    if(req.url.match("^/orders$")){
        var fs = require("fs");
        var buffer = fs.readFileSync(process.cwd() + "/pagination.html", 'utf-8');
        res.writeHead(200);
        res.end(buffer.toString('utf-8'));;
    }
    
    if (id = req.url.match("^/orders([?])page([=])([0-9]+)([&])size([=])([0-9]+)$")) {
        if (req.method == "GET") {         
            console.log("GET /orders");
            //console.log(id[0]);

            var page = id[3];
            var size = id[6];
            var numberOfItems = storage.getCountOfOrders();

            var link = "<http://" + req.headers.host + "/orders?page=";
            var link_first = link + "1" + "&size=" + size + ' rel="first">';
            var link_self = link + page + "&size=" + size + ' rel="self">';
            var link_next = link + (parseInt(page) + 1) + "&size=" + size + ' rel="next">';
            var x = numberOfItems / parseInt(size);
            var lastPage = parseInt(Math.ceil(x));
            var link_prev = link + (parseInt(page) - 1) + "&size=" + size + ' rel="prev">';
            var link_last = link + lastPage + "&size=" + size + ' rel="last">';
            
            res.writeHead(200, {
                "Content-Type": "application/json",
                "Location": "/orders",
                "Link": [link_self, link_first, link_last, link_prev, link_next]
            });
            res.write(JSON.stringify(storage.getOrders(page, size)));

            res.end();;
        }
        else {
            res.writeHead(501);
            res.end();
        }
    }
    else {
        console.log('Bad Request');
        res.writeHead(400);
        res.end();
    }

    req.on('end', function () {
        res.end();
    });

}).listen(port, function () {
    console.log("Server is running on port "+port);
});

var storage = {
    orders: [
        { "id": 1, "price": 900 },
        { "id": 2, "price": 200 },
        { "id": 3, "price": 3600 },
        { "id": 4, "price": 1400 },
        { "id": 5, "price": 9080 },
        { "id": 6, "price": 600 },
        { "id": 7, "price": 548 },
        { "id": 8, "price": 1470 },
        { "id": 9, "price": 2071 },
        { "id": 10, "price": 910 },
        { "id": 11, "price": 2000 },
        { "id": 12, "price": 1560 },
        { "id": 13, "price": 600 },
        { "id": 14, "price": 350 },
        { "id": 15, "price": 180 },
        { "id": 16, "price": 610 },
        { "id": 17, "price": 7100 },
        { "id": 18, "price": 100 },
        { "id": 19, "price": 200 },
        { "id": 20, "price": 5800 },
        { "id": 21, "price": 963 }
    ],

    getOrders: function (page, size) {
        var orders = [];
        var firstItem = (parseInt(size) * (parseInt(page) - 1));
        var lastItem = page * size;
        for (var i = firstItem; i < lastItem; i++) {
            orders.push(this.orders[i]);
        }
        return orders;
    },

    getCountOfOrders: function () {
        var count = 0;
        for (var i in this.orders)
            count++;
        return count;
    }
};