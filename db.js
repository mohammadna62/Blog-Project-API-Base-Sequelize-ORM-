const { Sequelize } = require("sequelize");
const configs = require("./configs");



const db = new Sequelize({
  host: configs.db.host,
  port: configs.db.port,
  username: configs.db.user,
  password: configs.db.password,
  database: configs.db.name,
  dialect: configs.db.dialect,
  logging: configs.isProduction ? false : console.log,
});
//* JsDoc
/** @type {import('sequelize').ModelCtor<import('sequelize').Model<any , any>}*/
const User = require("./models/User")(db);
/** @type {import('sequelize').ModelCtor<import('sequelize').Model<any , any>}*/
const Tag = require("./models/Tag")(db);
/** @type {import('sequelize').ModelCtor<import('sequelize').Model<any , any>}*/
const TagsArticles = require("./models/TagsArticles")(db);
/** @type {import('sequelize').ModelCtor<import('sequelize').Model<any , any>}*/
const Article = require("./models/Articles")(db);

User.hasMany(Article, {
  foreingKey: "author_id",
  onDelete: "CASCADE",
});

Article.belongsTo(User, { foreingKey: "author_id", as: "author" });

Article.belongsToMany(Tag, {
  through: TagsArticles,
  onDelete: "CASCADE",
  foreingKey: "article_id",
});

Tag.belongsToMany(Article, {
  through: TagsArticles,
  onDelete: "CASCADE",
  foreingKey: "tag_id",
});

module.exports = {db,User,Tag,Article};
