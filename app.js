//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');
const request=require("request");
const mongoose=require("mongoose");

const homeStartingContent = "Pack your bags, hit the road and don't forget to write down all of your amazing stories!";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Wish to know more about the journey? Want to get more details? Ping me up and I'll let you know the trip detials in person.";

const app = express();
mongoose.connect("mongodb+srv://admin-devansh:32001972@cluster0.tezsd.mongodb.net/blogDB",{useNewUrlParser:true,useUnifiedTopology: true});

const postSchema={
  title:String,
  date:String,
  content:String
};

const Post=mongoose.model("Post",postSchema);


var posts=[];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/",function(req,res){

  Post.find(function(err,result){
    if(err)console.log(err);
    else res.render("home",{homeIntro:homeStartingContent,BlogPosts:result});
  });

});

app.get("/about",function(req,res){
  res.render("about",{aboutIntro:aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{contactIntro:contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose");
});

app.post("/compose",function(req,res){
  var today=new Date();

  var options={
    weekday: "long",
    day:"numeric",
    month: "long"
  };

  var day=today.toLocaleDateString("en-US",options);

  const post=new Post({
    title:req.body.newBlogTitle,
    date:day,
    content:req.body.newBlog
  });

  post.save();
  res.redirect("/");
});

app.get("/posts/:postName",function(req,res){

const name=req.params.postName;

Post.findOne({title:name},function(err,posts){
  if(err)console.log(err);
  else res.render("post",{BlogTitle:posts.title,BlogContent:posts.content,BlogDate:posts.date});

})

//   console.log(req.params.postName);

});


app.post("/contact",function(req,res){
  var firstname=req.body.firstname;
  var lastname=req.body.lastname;
  var email=req.body.email;
//  console.log(firstname+lastname+email);

  var data={
    members: [{
      email_address:email,
      status: "subscribed",
      merge_fields:{
        FNAME:firstname,
        LNAME:lastname
      }
    }]
  };

  var jsondata=JSON.stringify(data);
  var options ={
    url: "https://us10.api.mailchimp.com/3.0/lists/701b77439b",
    method:"POST",
    headers: {
    "Authorization": "devanshrajgarhia c9398932e19fdb100ae8e43f1ba6364b-us10"
    },
    body: jsondata
    // qs:{
    //
    // }
  };
  request(options,function(error,response,body){
    if(error){
      console.log(error);
      //res.sendFile(__dirname+"/failure.html");
    }
    else{
    if(response.statusCode===200)
      res.render("success");

    // else{
    //   res.sendFile(__dirname+"/failure.html");
    // }
  }
  });

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
