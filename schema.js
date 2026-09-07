const joi=require('joi');

module.exports.listSchema=joi.object({
    listing : joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        image:joi.object({
        filename:joi.string().required(),
        url:joi.string().allow("",null).required()
        }).required(),
        price:joi.number().required().min(0).max(4500),
        location:joi.string().required(),
        country:joi.string().min(3).required(),
    }).required()

});

module.exports.reviewSchema=joi.object({
    review:joi.object({
        rating:joi.number().min(1).max(5).required(),
        comment:joi.string().required()
    }).required()
}).required();