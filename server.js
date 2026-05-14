const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));


app.post('/api/blog', (req, res) => {
    const adminPassword = process.env.BLOG_ADMIN_PASSWORD || 'change-this-password';
    const payload = req.body;

    if (!payload || typeof payload !== 'object') {
        return res.status(400).json({ success: false, message: 'Invalid JSON input or empty request body.' });
    }

    if (!payload.password || payload.password !== adminPassword) {
        return res.status(401).json({ success: false, message: 'Invalid admin password.' });
    }

    if (!payload.posts || !Array.isArray(payload.posts)) {
        return res.status(422).json({ success: false, message: 'Missing blog posts.' });
    }

    const cleanPosts = [];
    for (const post of payload.posts) {
        if (!post || typeof post !== 'object' || !post.title) {
            continue;
        }

        const content = Array.isArray(post.content) 
            ? post.content.map(String).filter(Boolean) 
            : [];

        cleanPosts.push({
            id: String(post.id || '').toLowerCase().replace(/[^a-z0-9-]/g, ''),
            title: String(post.title || '').trim(),
            category: String(post.category || 'Insights').trim(),
            excerpt: String(post.excerpt || '').trim(),
            image: String(post.image || 'Images/en-insight-img1.png').trim(),
            author: String(post.author || 'Vanced Solutions').trim(),
            date: String(post.date || new Date().toISOString().split('T')[0]).trim(),
            readTime: String(post.readTime || '5 min read').trim(),
            content: content
        });
    }

    const dataToWrite = JSON.stringify({ posts: cleanPosts }, null, 2);
    const dataPath = path.join(__dirname, 'blog-data.json');


    fs.writeFile(dataPath, dataToWrite, 'utf8', (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Unable to write blog-data.json. Check file permissions.' });
        }
        res.json({ success: true, message: 'Blog posts saved.' });
    });
});

const nodemailer = require('nodemailer');


app.post('/api/contact', express.urlencoded({ extended: true }), async (req, res) => {
    const { name, email, subject, message } = req.body;
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'thakuranit515@gmail.com',      
            pass: 'dagx rudq qohq gfzq'         
        }
    });

    const mailOptions = {
        from: `"${name}" <${email}>`,
        to: 'thakuranit515@gmail.com',   
        subject: `New Contact Form: ${subject}`,
        text: `You have a new message from your contact form.\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
        replyTo: email
    };

    try {
        console.log(`Sending contact form email from ${name} (${email})...`);
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
        res.json({ type: 'success', message: 'Contact form successfully submitted. Thank you, I will get back to you soon!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ type: 'danger', message: 'There was an error while submitting the form. Please check the server logs or verify your App Password.' });
    }
});

app.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log(`Server is running at ${url}`);
    console.log(`Access the admin panel at ${url}/blog-admin.html`);
    

    const { exec } = require('child_process');
    exec(`start ${url}`);
});
