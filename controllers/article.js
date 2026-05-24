const { default: slugify } = require("slugify");
const { Article, Tag } = require("./../db");

exports.create = async (req, res, next) => {
  try {
    let { title, content, tags } = req.body; // frontend -> ["frontend"]
    const slug = slugify(title, { lower: true });
    const authorId = req.user.id;

    tags = Array.isArray(tags) ? tags : [tags]; //* Convert to an array to have the same type of data (String or Array)

    tags = tags.map((tag) =>
      Tag.findOrCreate({ where: { title: tag.trim() } }),
    );
    tags = await Promise.all(tags);

    let article;
    const coverPath = `images/covers/${req.file?.filename}`;
    try {
      article = await Article.create({
        title,
        content,
        slug,
        author_id: authorId,
        cover: coverPath,
      });

      await article.addTag(tags.map((tag) => tag[0]));
      console.log("Tagggggggggggggggggggggssssss ->", tags[0]);

      return res
        .status(201)
        .json({ ...article.dataValues, tags: tags.map((tag) => tag[0].title) });
    } catch (err) {
      console.log("Error ->", err);
    }
  } catch (err) {
    next(err);
  }
};
