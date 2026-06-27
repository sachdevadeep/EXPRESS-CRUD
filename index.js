const express = require('express');
const users = require('./MOCK_DATA.json');
const app = express();

const fs=  require('fs');

const PORT = 8000;
app.use(express.urlencoded({extended:false}));

app.use((req,res,next)=>{
    console.log("Hello from middle1");
    next();
});


app.get('/users',(req,res)=>{
    res.setHeader("myName","Deep");
    console.log(req.headers);
    return res.json(users);
});
app.get('/api/users',(req,res)=>{

    const html =`
    <ul>
        ${users.map((user) => `<li>${user.first_name}</li>`).join("")}</ul>
    `;
    return res.send(html);
});

app.post('/api/users',(req,res)=>{
    // TODO: create a new user to the users array
    const body =  req.body;
     console.log(body);
    users.push({...body,id:users.length+1});

    fs.writeFile('MOCK_DATA.json',JSON.stringify(users),(err,data)=>{
        return res.json({status : "success" , id: users.length});
        return res.status(202).json({status:"success",id:users.length});
    });

    // return res.json({status : "pending"});
});
app.route('/api/users/:id')
.get((req,res)=>{
    const id = Number (req.params.id);
    const user = users.find((user) => user.id == id);
    return res.json(user);

})
.patch((req,res)=>{

    const id = Number(req.params.id);

    const body = req.body;

    const index = users.findIndex((user)=> user.id==id);
    if(index==-1){
        return res.json({status: "failed",msg:"URL not found"});
    }
    users[index] = {...body,id:id};
    
    // TODO Edit the user with given id
     return res.json({status : "pending"});
})
.delete((req,res)=>{
    // TODO Delete the user with given id
    const id = Number(req.params.id);
    const index = users.findIndex((user)=>  user.id==id);
    if(index==-1){
        return res.json({status :"failed",message:"Not found"});
    }

    users.splice(index,1);

    fs.writeFile('MOCK_DATA.json',JSON.stringify(users),(err,data)=>{

        if(err){
            return res.json({status:"failed",message:"Unable to delete the user"});
        }
        return res.json({status:"success",id :users.length-1});
    })
    // return res.json({status : "pending"});


});

app.listen(PORT,()=> console.log(`Server is running at PORT ${PORT}`));



