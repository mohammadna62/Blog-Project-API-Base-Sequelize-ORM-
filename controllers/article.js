const { default: slugify } = require("slugify");
const { Article, Tag, User } = require("./../db");

exports.create = async (req, res, next) => {
  try {
    let { title, content, tags } = req.body; // frontend -> ["frontend"]
    let slug = slugify(title, { lower: true });
    const copyOfSlug = slug;
    const authorId = req.user.id;

    tags = Array.isArray(tags) ? tags : [tags]; //* Convert to an array to have the same type of data (String or Array)

    tags = tags.map((tag) =>
      Tag.findOrCreate({ where: { title: tag.trim() } }),
    );
    tags = await Promise.all(tags);

    let article;
    let i = 1;
    const coverPath = `images/covers/${req.file?.filename}`;

    while (!article) {
      try {
        article = await Article.create({
          title,
          content,
          slug,
          author_id: authorId,
          cover: coverPath,
        });

        await article.addTag(tags.map((tag) => tag[0])); //Article.addTag() create َAutomatically by sequelize and add to TagsArticles tabale

        return res.status(201).json({
          ...article.dataValues,
          tags: tags.map((tag) => tag[0].title),
        });
      } catch (err) {
        //! Note: This part of the code that is written below is only used for MySQL/MariaDB.
        if (err.original.code === "ER_DUP_ENTRY") {
          slug = `${copyOfSlug}-${i++}`;
        } else {
          throw err;
        }
      }
    }
  } catch (err) {
    next(err);
  }
};
exports.findAll = async (req, res, next) => {
  const articles = await Article.findAll({
    attributes: {
      exclude: ["author_id"],
    },
    include: [
      {
        model: User,
        attributes: {
          exclude: ["password", "role"],
        },
        as: "author",
      },
      {
        model: Tag,
        attributes: ["title"],
        through: {
          attributes: [],
        },
      },
    ],
    order: [["created_at", "DESC"]],
  });
  if (!articles) {
    return res.status(404).json({ message: "Article Not Found!!" });
  }
  return res.json(articles);
};

exports.findBySlug = async (req, res, next) => {
  const article = await Article.findOne({
    where: {
      slug: req.params.slug,
    },
    attributes: {
      exclude: ["author_id"],
    },
    include: [
      {
        model: User,
        attributes: {
          exclude: ["password"],
        },
        as: "author",
      },
      {
        model: Tag,
        attributes: ["title"],
        through: {
          attributes: [],
        },
      },
    ],
  });
  if (!article) {
    return res.status(404).json({ message: "Article Not Found!!" });
  }
  const tags = article.dataValues.tags.map((tag) => tag.title);
  return res.json({ ...article.dataValues, tags });
};

exports.deleteArticle = async (req, res, next) => {
  const { id } = req.params;
  const article = await Article.findByPk(id, { row: true });
  if (!article) {
    return res.status(404).json({ message: "Article not found !!" });
  }
  if (article.author_id !== req.user.id) {
    return res.status(403).json({ message: "Forbidden !!" });
  }
  await Article.destroy({ where: { id } });

  return res.status(200).json({ message: "Article removed successfully" });
};
