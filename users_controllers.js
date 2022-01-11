// const { findOneAndUpdate, findById } = require('../models/users');
const User=require('../models/users');
const fs=require('fs');
const path=require('path');


module.exports.profile =function(req,res){
   // return res.end('<h1>User Profile</h1>');
   // if(req.cookies.user_id){
   //    User.findById(req.cookies.user_id,function(err,user){
   //       if(user){
   //          return res.render('user_profile',{
   //             title:"User Profile",
   //             user:user
   //          })
   //       }
   //    })
   // }
   // else{
   // return res.redirect('/users/sign-in');
   // }
   User.findById(req.params.id,function(err,user){
      return res.render('user_profile',{
         title:'User Profile',
         user_profile:user

      });
   })
}

module.exports.update= async function(req,res){
      // if(req.user.id==req.params.id){
      //    User.findByIdAndUpdate(req.params.id, req.body,function(err,user){
      //       return res.redirect('back');
      //    });
      // } 
      // else{
      //    return res.status(401).send('Unauthorized');
      // }
   
      if(req.user.id==req.params.id){
         
         
         try{
            let user=await User.findById(req.params.id);

             User.uploadedAvatar(req,res,function(err){
               if(err){
                  console.log('******Multer Error: ',err);
               }
               
               user.name=req.body.name;
               user.email=req.body.email;

               if(req.file){
                  // this is saving the path of uploaded file into the avatar field into the user
                   if(user.avatar){
                      fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                   }
                  user.avatar=User.avatarPath +'/'+ req.file.filename;
               }
               user.save();
               return res.redirect('back');
            });
         }catch(err){
            req.flash('error',err);
            return res.redirect('back');
         }
      }
      else{
         req.flash(error,'Unauthorized');
         return res.status(401).send('Unauthorized');
      }
}

// render the sign up page
module.exports.signUp=function(req,res){
   if(req.isAuthenticated()){
      return res.redirect('/users/profile/'+req.user._id);
   }
   
   
   return res.render('User_sign_up',{
      title: "codeial | Sign Up"
   })
}
// render the sign in page
module.exports.signIn=function(req,res){
   if(req.isAuthenticated()){
      return res.redirect('/users/profile/'+req.user._id);
   }
   return res.render('User_sign_in',{
      title: "codeial | Sign In"
   })

   }
// get the sign up data
   module.exports.create= function(req,res){
      if(req.body.password!=req.body.confirm_password){
         
         return res.redirect('back');
      }
      User.findOne({
         email:req.body.email},function(err,user){
            if(err){
               console.log('error in finding the user in signing up');
               return;
           }
               if(!user){
                  User.create(req.body,function(err) {
                     if(err){
                        console.log('error in creating user while signing up');
                        return;
                     }
                     return res.redirect('/users/sign-in');

                  })
               }
            else{
               return res.redirect('back');
            }
         })
   }
// Sign in and create a session for the user
   module.exports.createSession=function(req,res){
      req.flash('success','Logged in Successfully');
      return res.redirect('/');
      
   }

   module.exports.destroySession=function(req,res){
      req.logout();
      req.flash('success','You have logged out');
      return res.redirect('/');
   }