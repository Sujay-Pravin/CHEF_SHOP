import foodModel from "../models/foodModel.js";
import fs from "fs";

// Create a new food item

const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: image_filename,
        category: req.body.category
    })
    try{
        await food.save();
        res.json({success:true, message:"Food item added successfully"});
    }
    catch(error){
        console.log(error);
        res.json({success:false, message:"Failed to add food item"});
    }
};

// all food list

const listFood = async (req, res) => {
    try{
        const foods = await foodModel.find({});
        res.json({success:true, food:foods});
    }
    catch(error){
        console.log(error);
        res.json({success:false, message:"Failed to fetch food items"});
    }

}

//remove food

const removeFood = async (req, res) => {
    try{
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,() => {})
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message:"Food item deleted successfully"});
       
    }
    catch(error){
        console.log(error);
        res.json({success:false, message:"Failed to delete food item"});
    }

}


export { addFood, listFood, removeFood };