const express = require('express');
const Sequelize = require('sequelize-cockroachdb');

const app = express();
app.use(express.json());

let sequelize = new Sequelize('test_db', 'postgres', 'postgres', {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
});

const UserFactory = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        id: {  type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        name: { type: DataTypes.STRING },
        email: { type: DataTypes.STRING },
        createdAt: {type: DataTypes.DATE, field: 'created_at'},
        updatedAt: {type: DataTypes.DATE, field: 'updated_at'},
        deletedAt: {type: DataTypes.DATE, field: 'deleted_at'},
    }, {
        timestamps: true,
        paranoid: true
    });
    User.associate = (models) => {
    }
    return User;
}

const db = {
    sequelize,
    Sequelize,
    User: UserFactory(sequelize, Sequelize)
};

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
  

db.sequelize.sync({ force: true }).then(function() {console.log('Nice! Database looks fine')}).then(() => {

});


app.post('/user', async(req, res) => { 
    const user = await db.User.create(req.body);
    res.send(user);
});

app.get('/users', async(req, res) => {
    const users = await db.User.findAll();
    res.send(users);
});

const port = 3050;
app.listen(port, () => console.log('Server listening on port 3050'));