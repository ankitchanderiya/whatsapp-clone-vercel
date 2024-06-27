import mongoose from 'mongoose';

const Connection = async (username, password) => {
    console.log("indatabase");
    const URL = `mongodb://${username}:${password}@ac-7zvf4tf-shard-00-00.zbvynnr.mongodb.net:27017,ac-7zvf4tf-shard-00-01.zbvynnr.mongodb.net:27017,ac-7zvf4tf-shard-00-02.zbvynnr.mongodb.net:27017/?ssl=true&replicaSet=atlas-td6b6o-shard-0&authSource=admin&retryWrites=true&w=majority`;
    try {
        await mongoose.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });
        console.log('Database Connected Succesfully');
    } catch(error) {
        console.log('Error: ', error.message);
    }

};

export default Connection;