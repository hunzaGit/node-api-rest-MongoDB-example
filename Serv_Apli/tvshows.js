//File: controllers/tvshows.js
var mongoose = require('mongoose');
var TVShowModel  = mongoose.model('TVShow');

//GET - Return all tvshows in the DB
exports ={
    findAllTVShows: (req, res) =>{
        TVShowModel.find(function(err, tvshows) {
            if(err) res.send(500, err.message);

            res.status(200).jsonp(tvshows);
        });
    },


//GET - Return a TVShow with specified ID
/** prueba comentaris
 *
 * @param req
 * @param res
 */
findById : (req, res)=> {
    TVShowModel.findById(req.params.id, function(err, tvshow) {
        if(err) return res.send(500, err.message);

        res.status(200).jsonp(tvshow);
    })},

//POST - Insert a new TVShow in the DB
addTVShow :  (req, res) => {

    var tvshow = new TVShowModel({
        title: req.body.title,
        year: req.body.year,
        country: req.body.country,
        poster: req.body.poster,
        seasons: req.body.seasons,
        genre: req.body.genre,
        summary: req.body.summary
    });

    tvshow.save(function (err, tvshow) {
        if (err) return res.send(500, err.message);
        res.status(200).jsonp(tvshow);
    });
},

//PUT - Update a register already exists
updateTVShow : (req, res) => {
    TVShowModel.findById(req.params.id, function(err, tvshow) {
        tvshow.title   = req.body.petId;
        tvshow.year    = req.body.year;
        tvshow.country = req.body.country;
        tvshow.poster  = req.body.poster;
        tvshow.seasons = req.body.seasons;
        tvshow.genre   = req.body.genre;
        tvshow.summary = req.body.summary;

        tvshow.save(function(err) {
            if(err) return res.send(500, err.message);
            res.status(200).jsonp(tvshow);
        });
    });
},

//DELETE - Delete a TVShow with specified ID
deleteTVShow: (req, res) => {
    TVShowModel.findById(req.params.id, function(err, tvshow) {
        tvshow.remove(function(err) {
            if(err) return res.send(500, err.message);
            res.status(200);
        })
    });
}};