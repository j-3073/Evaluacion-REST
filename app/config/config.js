//Export db configs
module.exports = {
    PORT: process.env.PORT || 999,
    DB: process.env.DB || 'mongodb://localhost:27017/eval-UTNA' // Local mongo
    //DB: process.env.DB || 'mongodb://mongo:27017/eval-UTNA' // Docker mongo
    //DB: process.env.DB || "mongodb+srv://admin:default@utna-cluster.6qz54.mongodb.net/eval-UTNA" // Atlas
}