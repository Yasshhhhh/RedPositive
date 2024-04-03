const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const Schema = mongoose.Schema;

const port = 5000;
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yasshhanil@gmail.com', 
    pass: 'fmsm scot hqcw dant' 
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Error verifying transporter:', error);
  } else {
    console.log('Transporter ready to send emails');
  }
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const userSchema = new Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String , required: true },
    email: { type: String , required: true },
    hobbies: { type: String, required: true  } 
});

const User = mongoose.model('User', userSchema);

const mongoURI = 'mongodb+srv://Yash:123@cluster0.aozxgbq.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


    
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/users', (req, res) => {
    User.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.status(500).send('Error fetching users from database');
        });
});

app.put('/updateUser/:id', async (req, res) => {
    const { id } = req.params;
    const { name, phoneNumber, email, hobbies } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, phoneNumber, email, hobbies },
            { new: true }
            );

            if(updatedUser)
            console.log("found");
        
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.post('/addUser', (req, res) => {
    const { name, phoneNumber, email, hobbies } = req.body;
    const newUser = new User({ name, phoneNumber, email, hobbies }); 
    newUser.save() 
        .then(() => {
            console.log('User added:', newUser);
            res.status(201).json({ message: 'User added successfully' });
        })
        .catch(err => {
            console.error('Error adding user:', err);
            res.status(500).json({ error: 'Failed to add user' });
        });
});


app.post('/sendEmail', async (req, res) => {
    const { users } = req.body;
   console.log(users);
    try {
        const mailOptions = {
            from: 'yasshhanil@gmail.com',
            to: 'info@redpositive.in',
            subject: 'Full Stack Assignment',
            html: generateHTML(users)
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
});

const generateHTML = (users) => {
    let html = '<h1>Selected Users</h1>';
    html += '<table border="1">';
    html += '<tr><th>Name</th><th>Email</th><th>Phone Number</th><th>Hobbies</th></tr>';
    users.forEach(user => {
        html += '<tr>';
        html += `<td>${user.name}</td>`;
        html += `<td>${user.email}</td>`;
        html += `<td>${user.phoneNumber}</td>`;
        html += `<td>${user.hobbies}</td>`;
        html += '</tr>';
    });
    html += '</table>';
    return html;
};

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Server is listening at ${port}`);
});
