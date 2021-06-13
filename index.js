const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const Group = require('./models/groups')




mongoose.connect('mongodb://localhost:27017/upmeet', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected!")
})

/*app.use(session(sessionConfig));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());*/


// app.get('/tests', async (req, res) => {
//     const user = new User({ email: 'colt@gmail.com', username: 'ray' })
//     const newUser = await User.register(user,'chicken');
//     res.send(newUser);
// })


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./public"))

const sessionConfig = {
    secret: 'notagoodsecret',
    resave: false,
    saveUninitialized: false
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/');
    }
    next();
}

app.get('/fake', async (req, res) => {
    const usr = new User({ username: 'yan', email: 'n@gmail.com' });
    const newUsr = await User.register(usr, 'ree');
    res.send(newUsr);
})

app.get('/', async (req, res) => {
    console.log('homepage');
    res.render('index')
})

app.get('/index', async (req, res) => {
    console.log('homepage');
    res.render('index')
})

app.get('/search',isLoggedIn , async (req, res) => {
    const grp = await Group.find({ "location": req.query.location, "interest": req.query.interest });
    console.log(grp);
    console.log(req.query);

    res.render('search', { grp });
})


app.get('/friends', isLoggedIn, async (req, res) => {
    console.log('friends');
    const grp = await Group.find($or[{"interest":"Dance"},{"interest":"Book Clubs"},{"interest":"Food"}]);

    res.render('friends', { grp });
})

app.get('/createGrp', isLoggedIn, async (req, res) => {
    console.log('createGrp');
    res.render('createGrp')
})

app.get('/contact', async (req, res) => {
    console.log('contact');
    res.render('contact')
})



app.get('/outdoors', isLoggedIn, async (req, res) => {
    console.log('outdoors');
    const grp = await Group.find($or[{"interest":"Arts"},{"interest":"Adventure"},{"interest":"Painting"}]);


    res.render('outdoors', { grp });
})

app.get('/about', async (req, res) => {
    console.log('about');
    res.render('about')
})

app.get('/connectTech', isLoggedIn, async (req, res) => {
    console.log('connectTech');
    const grp = await Group.find($or[{"interest":"Science"},{"interest":"HR"},{"interest":"Coding"}]);


    res.render('connectTech', { grp });
})

app.post('/makegroup', isLoggedIn, async (req, res) => {
    const grp = new Group(req.body.group);
    await grp.save();
    res.redirect(`/group/${grp._id}`);
})


app.post('/makeusr', async (req, res) => {
    try {
        const { email, username, password } = req.body.user;
        const usr = new User({ email, username });

        const registeredUser = await User.register(usr, password);
        console.log(registeredUser);
        req.login(registeredUser, err => {
            if (err)
                return next(err);
        })
        req.flash('success', 'Welcome to Upmeet')
        res.redirect('/');
    }
    catch (e) {
        req.flash('error', e.message);
        console.log('error', e.message);
        res.redirect('/');
    }
})

app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/' }), async (req, res) => {
    req.flash('success', 'Welcome Back');
    const redirectUrl = req.session.returnTo || '/';
    res.redirect(redirectUrl);
})

app.get('/makegrp', isLoggedIn, async (req, res) => {
    const grp = new Group({ name: 'hk', interest: 'outdoors', groupName: 'hkp', description: 'asdfg', location: 'pune' });
    await grp.save();
    res.send(grp);
})


app.get('/group/:id', isLoggedIn, async (req, res) => {
    console.log('group');
    const grp = await Group.findById(req.params.id);
    //res.send(grp);
    //console.log(req.params.id);
    res.render('group', { grp });
})

app.get('/messages/:id', isLoggedIn, async (req, res) => {
    console.log('messages');
    const grp = await Group.findById(req.params.id);

    console.log(grp);
    res.render('messages', { grp });
})

app.post('/postmsg/:id', isLoggedIn, async (req, res) => {
    console.log('message posted');
    const usr = req.user.username;
    const { msg } = req.body;
    const grp = await Group.findById(req.params.id);
    const message = {
        userId: usr,
        messages: msg
    };
    grp.msgList.push(message);
    await grp.save();
    console.log(grp);
    //res.redirect(`/messages/${req.params.id}`);
})

app.post('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Logged out Successfully!");
    res.redirect('/');
})

app.all('*', (err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message)
        err.message = 'Oh No!, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log("App is listening on port 3000!");
})