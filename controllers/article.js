const { default: slugify } = require("slugify");
const { Article, Tag } = require("./../db");

exports.create = async (req, res, next) => {
  try {
    let { title, content, tags } = req.body; // frontend -> ["frontend"]
    const slug = slugify(title, { lower: true });
    const authorId = req.user.id;

    tags = Array.isArray(tags) ? tags : [tags];//* Convert to an array to have the same type of data (String or Array)

    tags = tags.map((tag) =>
      Tag.findOrCreate({ where: { title: tag.trim() } })
    );
    tags = await Promise.all(tags);

    // const fileBuffer = req.file.buffer;
    // const coverPath = `/images/covers/${Date.now()}${req.file.originalname}`;

    // sharp(fileBuffer)
    //   .png({
    //     quality: 60,
    //   })
    //   .toFile(`./public${coverPath}`);

    // const article = await Article.create({
    //   title,
    //   content,
    //   slug,
    //   author_id,
    //   cover: coverPath,
    // });

    // tags.forEach(async (tag) => {
    //   await Article.addTag(article.id, Number(tag));
    // });

    // req.flash("success", "مقاله مورد نظر با موفقیت ایجاد شد");
    // return res.redirect("/p-admin/create-article");
    return res.json("ok")
  } catch (err) {
    next(err);
  }
};
