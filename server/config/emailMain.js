const nodemailer = require("nodemailer");
require('dotenv').config();
exports.getCSS = () => `
@keyframes bounce {
    0%, 100% {
        transform: translateY(-5px);
    }
    50% {
        transform: translateY(5px);
    }
}
body {
    font-family: Arial, sans-serif;
    background: linear-gradient(to right, #a8e6cf, #dcedc1);
    transition: background-color 5s;
    height:700px;
}
.card {
    padding: 20px;
    width: 400px;
    min-height: 700px;
    border-radius: 20px;
    background: #e8e8e8;
    box-shadow: 5px 5px 6px #dadada,
                -5px -5px 6px #f6f6f6;
    transition: 0.4s;
    margin-left:10%
}
img {
        width: 200px;
        height: auto;
        margin-top: 40px;
        margin-left:80px;  
        
    }
.card:hover {
translate: 0 -10px;
}

.card-title {
font-size: 18px;
font-weight: 600;
color: #2e54a7;
margin: 15px 0 0 10px;
}
.reason{
    color:red;
}

.card-image {
min-height: 170px;
background-color: #cfcfcf;
border-radius: 15px;
box-shadow: inset 8px 8px 10px #c3c3c3,
            inset -8px -8px 10px #cfcfcf;
}

.card-body {
margin: 13px 0 0 10px;
color: rgb(31, 31, 31);
font-size: 14.5px;
}

.footer {
float: right;
margin: 28px 0 0 18px;
font-size: 13px;
color: #636363;
}

.by-name {
font-weight: 700;
}

@keyframes bounce {
        0%, 100% {
            transform: translateY(-5px);
        }
        50% {
            transform: translateY(5px);
        }
    }

ul {
    list-style-type: none;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}
a {
    color: #337ab7;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s;
}
a:hover {
    color: #ff8b94;
}
h2 {
    font-family: 'Roboto', sans-serif;
    font-size: 24px;
}
li {
    display: flex;
    align-items: center;
    transition: transform 0.3s;
    grid-column: span 2;
}
i {
    margin-right: 10px;
}
li:hover {
    transform: scale(1.1);
}
@media (max-width: 768px) {
body:hover {
    background-color: #dcedc1;
}
.card {
    padding: 20px;
    width: 350px;
    min-height: 800px;
    margin-left:0%
  }
img {
    width: 200px;
    height: auto;
    margin-top: 40px;
    margin-left:30px;  
    
}
}
`;
async function sendForgetPasswordToken(sendto, token) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  const mailOptions = {
    from: "amanuelgirma108@gmail.com",
    to: sendto.username,
    subject: "New Todo Added",
    html: `<html>
    <head>
        <style>${exports.getCSS()}</style> 
        <link rel="stylesheet" href="https://www.bootstrapcdn.com/fontawesome/6.4.0/css/all.min.css">
    </head>
    <body>
    <div class="card">
        <div class="card-image">
        </div>
        <p class="card-title">Dear ${sendto.username},</p>     
        <p class="card-title">Password Recovery</p>    
        <p class="card-body"><a href='http://localhost:4000/users/changepassword?token=${token}'>Change Password</a></span></p>  
    </div>
    </body>
</html>`

  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`http://localhost:3000/resetpassword?token=${token}`)
    console.log("Email notification sent successfully");
  } catch (error) {
    console.error("Error sending email notification:", error);
  }
}

module.exports = { sendForgetPasswordToken };
