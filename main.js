const express = require('express');
const users = require('./MOCK_DATA.json');
const app = express();

const fs = require('fs');

const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    console.log("Hello from middle1");
    next();
});

app.get('/users', (req, res) => {
    res.setHeader("myName", "Deep");
    console.log(req.headers);
    return res.status(200).json(users);
});

app.get('/api/users', (req, res) => {

    const html = `
    <ul>
        ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;

    return res.send(html);
});

app.post('/api/users', (req, res) => {

    const body = req.body;

    console.log(body);

    users.push({ ...body, id: users.length + 1 });

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {

        if (err) {
            return res.status(500).json({
                status: "failed",
                message: "Unable to create user"
            });
        }

        return res.status(201).json({
            status: "success",
            id: users.length
        });

    });

});

app.route('/api/users/:id')

.get((req, res) => {

    const id = Number(req.params.id);

    const user = users.find((user) => user.id === id);

    if (!user) {
        return res.status(404).json({
            status: "failed",
            message: "User not found"
        });
    }

    return res.status(200).json(user);

})

.patch((req, res) => {

    const id = Number(req.params.id);

    const body = req.body;

    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
        return res.status(404).json({
            status: "failed",
            message: "User not found"
        });
    }

    users[index] = {
        ...users[index],
        ...body
    };

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {

        if (err) {
            return res.status(500).json({
                status: "failed",
                message: "Unable to update user"
            });
        }

        return res.status(200).json({
            status: "success"
        });

    });

})

.delete((req, res) => {

    const id = Number(req.params.id);

    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
        return res.status(404).json({
            status: "failed",
            message: "User not found"
        });
    }

    users.splice(index, 1);

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {

        if (err) {
            return res.status(500).json({
                status: "failed",
                message: "Unable to delete user"
            });
        }

        return res.status(204).send();

    });

});

app.listen(PORT, () => console.log(`Server is running at PORT ${PORT}`));