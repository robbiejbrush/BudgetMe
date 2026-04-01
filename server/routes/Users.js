const express = require("express");
const router = express.Router();
const { Users } = require('../models');
const {sign} = require('jsonwebtoken');

//Check if user exists and return, or create and return if exisiting == null
router.post("/", async (req, res) => {
    try {
        const {email, name} = req.body;
    
        //Try to find user in db
        let user = await Users.findOne( {where: {email: email}} );

        //If user returned null, create it and set it
        if (!user) {
            user = await Users.create({
                email: email,
                name: name
            })
        }
        
        const accessToken = sign({userId: user.userId, email: user.email, name: user.name}, "l4FH1iXUz6");
        
        res.json(accessToken);
    } catch (error) {
        console.error("Error when getting/creating user:", error);
        res.status(500).json({ error: "Failed to get/create user." });
    }
});

module.exports = router;