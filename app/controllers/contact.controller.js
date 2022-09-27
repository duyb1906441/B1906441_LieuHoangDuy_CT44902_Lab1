//const ContactService =require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
class ContactService {  
        async find(filter) {
            const cursor = await this.Contact.find(filter);
            return await cursor.toArray();
        }
        async findByName(name) {
            return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },
            });
        }   
        async findById(id) {
            return await this.Contact.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
            });
        } 
        async update(id, payload) {
            const filter = {
                _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
            };
            const update = this.extractConactData(payload);
            const result = await this.Contact.findOneAndUpdate(
                filter,
                { $set: update },
                { returnDocument: "after" }
            );
            return result.value;
        }
        async delete(id) {
            const result = await this.Contact.findOneAndDelete({
                _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
            });
            return result.value;
        }
        async findFavorite() {
            return await this.find({ favorite: true });
        }
        async deleteAll() {
            const result = await this.Contact.deleteMany({});
            return result.deletedCount;
        }

};

exports.create = async (req,res,next)=>{
    if(!req.body?.name){
        return next(new ApiError(400, "Name can not be empty"));

    }
    try{
        const contactService = new ContactService(MongoDB.client);
        const decument = await contactService.create(req.body);
        return res.send(document);
    }
    catch(error){
        return next(
            new ApiError(500,"An error occurred while creating the contact")
        );
    }
};


exports.findAll = async (req, res, next) => {
    let document = [];
    try{
        const contactService = new ContactService(MongoDB.client);
        const {name} = req.query;
        if(name){
            document = await contactService.findByName(name);

        }
        else{
            document = await contactService.find({});

        }
    }
    catch(error){
        return next (
            new ApiError(500,"An error occurred while retrieving contacts")
        );
    }
    return res.send(documents);
};
exports.findOne = async(req, res, next) => {
    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findById(req.params.id);
        if(!document) {
            return next(new ApiError(484,"Contact not found"));
        }return res.send(document);

    }
    catch(error){
        return next(
            new ApiError(
                500,
                `Error retrieving contact with id=${req.params.id}`
            )
        )
    }
};

exports.update = async(req, res,next) => {
    if(Object.keys(req.body).length = 0){
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(req.params.id, req.body);
        if(!document){
            return next(new ApiError(484, " Contact was updated successfully"));

        }
        return res.send({message:"Contact was updated successfully"});
    }
    catch(error){
        return next(
            new ApiError(500,`Error update contact with id=$(req.params.id)`)
       );
    }

};

exports.delete = async(req, res, next) => {
    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if(!document){
            return next(new ApiError(404,"Contact not found"));
        }
        return res.send({message:"Contact was deketed successfully"});
    }
    catch(error){
        return next(
            new ApiError(
                500,`Could not delete contact with id=${req.params.id}`
            )
        );
    }
};

exports.deleteAll = async(_req, res, next) => {
    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.deleteAll();
        return res.send({
            message: `${deletedCount} contacts were deleted successfully`, 
        });
    }
    catch(error){
        return next(
            new ApiError(500,`An error occurred while removing all contacts`
            )
        );
    }
};

exports.findAllFavorite = async(_req, res,next) => {
    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findFavorite();
        return res.send(documents);
    }
    catch(error){
        return next(
            new ApiError(
                500,
                `An error occurred while retrieving favorite contacts`
            )
        );
    }
};
