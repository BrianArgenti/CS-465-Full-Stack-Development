// const fs = require('fs');
// const trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

const tripsEndpoint = 'http://localhost:3000/api/trips';
const options = {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
};

const travel = async function(req, res, next) {
    // console.log('BEGIN TRAVEL CONTROLLER');
    await fetch(tripsEndpoint, options)
        .then((res) => res.json())
        .then((json) => {
            let message = null;
            if (!(json instanceof Array)) {
                message = 'APIlookup error';
                json = [];
            } else {
                if (!json.length) {
                    message = ' No trips exist in our database.';
                }
            }
            res.render("travel", { title: "Travlr Getaways", trips: json, message });
        })
        .catch((err) => res.status(500).send(err.message));
};

module.exports = {
    travel
}
