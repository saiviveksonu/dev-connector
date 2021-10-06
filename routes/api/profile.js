const express = require("express");
const router = express.Router();
const request=require("request");
const config = require('config');
const auth = require("../../middleware/auth")
const Profile = require("../../models/profile")
const User = require("../../models/User")
const { check, validationResult } = require('express-validator');
const { post } = require("../../models/post");
// this "/" is equal to the endpoint /api/profile
// the below route is to get the profile of the  single 
// this the private route so we check the authentication
router.get("/me", auth, async (req, res) => {
    try {
        console.log("profile")
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({ mag: "the profile doesnt exist for user" })
        }
           return res.json(profile);
        
    } catch (error) {
        console.log(error)
        res.status(500).send("server error")
    }
})
// below route is to post the profile of the user
router.post("/", [auth, [check('status', "stauts is required").not().isEmpty(), check('skills', "skills is required").not().isEmpty()]], async (req, res) => {
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {
        company,
        website,
        location,
        status,
        skills,
        bio,
        youtube,
        facebook,
        twitter,
        linkdien,
        instagram
    } = req.body
    const profileFields = {}
    profileFields.user = req.user.id
    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (status) profileFields.status = status
    if (bio) profileFields.bio = bio
    // if (githubusername) profileFields.githubusername = githubusername
    if (skills) {
        profileFields.skills = skills.split(',').map(skill =>''+ skill.trim())
    }
    // building the profile fields
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube
    if (twitter) profileFields.social.twitter = twitter
    if (facebook) profileFields.social.facebook = facebook
    if (linkdien) profileFields.social.linkdien = linkdien
    if (instagram) profileFields.social.instagram = instagram
    try {
        let profile = await Profile.findOne({ user: req.user.id })
        // console.log(profile);
        if (profile) {
            const profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
            return res.json(profile)
        }
        profile = new Profile(profileFields);
        await profile.save()
        res.json(profile);
    } catch (error) {
        console.log(error)
        res.status(500).send("server error")
    }
})
// the below route is to get the profile of all the users 
// this the public route
router.get("/", async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ["name", "avatar"])
        res.json(profiles)
    } catch (error) {
        console.log(error)
        res.status(500).send("server error")
    }
})
// if user clicks on a single profile out of all profile then we have to show a single profile
// we are creating a route for showing the single user
router.get("/user/:user_id", async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ["name", "avatar"])
        if (!profile) {
            return res.status(400).json({ msg: "profile not found" })
        }
        res.json(profile)
    } catch (error) {
        console.log(error)
        if (error.kind === "ObjectId") {
            return res.status(400).json({ msg: "profile not found" })
        }
        res.status(500).send("server error")
    }
})
// 
// creating the route to delete the profile which is private route
// here we can delete the posts,user,profie
router.delete("/", auth, async (req, res) => {
    try {
        await post.deleteMany({user:req.user.id})
        // removes the profile
        await Profile.findOneAndRemove({ user: req.user.id })
        // remove the user 
        await Profile.findOneAndRemove({ _id: req.user.id })
        res.json({ msg: "the profile has been removed" })
    } catch (error) {
        console.log(error)
        res.status(500).send("server error")
    }
})
// 
// using the put method we can add the experience details of the user
router.put("/experience", [auth,
     [check('title', "title is required").not().isEmpty(), 
     check('company', "company is required").not().isEmpty(), 
     check('from', "from date is required").not().isEmpty()]], 
     async (req, res) => {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const {title,company,location,from,to,current,description}=req.body
    const userExperience={title,company,location,from,to,current,description}
    try {
        // we have to fetch the profile where we want to add the experience
        const profile=await Profile.findOne({user:req.user.id})
        // we want to add the object profile at the end of our object
        profile.experience.unshift(userExperience);
        await profile.save()
        res.json(profile)
    } catch (error) {
        console.log(error)
        res.status(500).send("server error")
    }
})
//  
// deleting the experience of the user 
// creating the route for deleting the user experience
router.delete("/experience/:exp_id", auth, async (req, res) => {
    try {
        const profile=await Profile.findOne({user:req.user.id})
        // getting the index
        const removeIndex=profile.experience.map(item=>item.id).indexOf(req.params.exp_id)
        profile.experience.splice(removeIndex,1)
        await profile.save()
        res.json(profile)
    } catch (error) {
        console.log(error)
        res.status(500).send("server error")
    }
})
// 
// adding the education details of the user
// 
// using the put method we can add the education details of the user
router.put("/education", [auth,
    [check('school', "school is required").not().isEmpty(), 
    check('degree', "degree is required").not().isEmpty(), 
    check('fieldofstudy', "fieldofstudy is required").not().isEmpty()]], 
    async (req, res) => {
   const errors=validationResult(req);
   if(!errors.isEmpty()){
       return res.status(400).json({ errors: errors.array() });
   }
   const {school,degree,fieldofstudy,from,to,current,description}=req.body
   const userEducation={school,degree,fieldofstudy,from,to,current,description}
   try {
       // we have to fetch the profile where we want to add the experience
       const profile=await Profile.findOne({user:req.user.id})
       // we want to add the object profile at the end of our object
       profile.education.unshift(userEducation);
       await profile.save()
       res.json(profile)
   } catch (error) {
       console.log(error)
       res.status(500).send("server error")
   }
})
//  
// deleting the experience of the user 
// creating the route for deleting the user experience
router.delete("/education/:edu_id", auth, async (req, res) => {
   try {
       const profile=await Profile.findOne({user:req.user.id})
       // getting the index
       const removeIndex=profile.education.map(item=>item.id).indexOf(req.params.edu_id)
       profile.education.splice(removeIndex,1)
       await profile.save()
       res.json(profile)
   } catch (error) {
       console.log(error)
       res.status(500).send("server error")
   }
})
// creating the route for the github repository

// router.get("/github/:username", async (req, res) => {
//     try {
//        const options={
//           uri: `http://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubclientid')}&client_secret=${config.get('githubsecretkey')}`,
//           method:"GET",
//           headers:{'user-agent':'node.js'}
//        }
//        request(options,(error,response,body)=>{
//            if(error){
//                console.log(error)
//            }
//            if(response.status!==200){
//                res.status(400).json({msg:"no github profile found"})
//            }
//            res.json(JSON.parse(body))
//        })
//     } catch (error) {
//         console.log(error)
//         res.status(500).send("server error")
//     }
// })
module.exports = router;