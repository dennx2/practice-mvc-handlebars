/* ******************************************************************************** 
 * ITE5315 – Assignment 2
 * I declare that this assignment is my own work in accordance with Humber Academic Policy. 
 * No part of this assignment has been copied manually or electronically from any other source (including web sites) or distributed to other students. 
 * Name: Jaydenn Chang Student ID: N01511476 Date: 2023/04/07 * 
 ******************************************************************************** */ 

// Step 4
// a) What is the role of "main.hbs"? How does it being used/called in the app? 
// main.hbs under views folder is a template for the main content of a the page. This template contains the specific content that shuold be displayed for a particular route. 

// b) What is the role of "index.hbs"? How do these files being used/called in the app? 
// index.hbs under layouts folder is the main layout template that defines the common elements of all the views in the application. The file can define common elements such as header, footer, navigation, and any other repeated elements that should appear on all pages. It ususally uses placeholders, such as {{{body}}} in this case, to replace content specific to each page.

// Step 10
// In this app, do you find any use cause for utilizing “Partial” Templates?
// It seems like using Partials were not necessary based on the instruction. But I still added it for the seach forms. 



const express = require("express");
const app = express();
const port = 3000;

const handlebars = require("express-handlebars");
// const Handlebars = handlebars.create({});

const fs = require("fs");
let data = fs.readFileSync("public/books.json");
let bookData = JSON.parse(data);

// sets our app to use handlebars engine
app.set("view engine", "hbs");

// set the hbs configurations
app.engine(
    "hbs",
    handlebars.engine({
        extname: "hbs",
        defaultLayout: "index",
        layoutDir: __dirname + "/views/layouts",
        partialDir: __dirname + "/views/partials",
        // Step 9
        // Register handlebars helper
        helpers: {
            zeroIfEmpty: (value) => {
                return value === 0 ? "zero" : value;
            },
            ifEq: (a, b, options) => {
                if (a === b) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            },
        },
    })
);

// Serve static files from the public directory
app.use(express.static("public"));

// Set up a route to render the index page
app.get("/", (req, res) => {
    res.render("main", { layout: "index" });
});

// Step 6
// Routes from Assignment 1
app.get("/data", (req, res) => {
    res.render("pages/data", { msg: "JSON data is loaded and ready!" });
    console.log(bookData);
});

app.get("/data/isbn/:index", (req, res) => {
    record = bookData[req.params.index];
    if (record) {
        res.render("pages/isbn", { isbn: record.isbn });
    } else {
        res.status(500).send("Book index not found!");
    }
});

// the isbnForm sent is not used
app.get("/data/search/isbn", (req, res) => {
    res.render("pages/searchIsbn", {
        isbnForm: `
        <form method="GET" action="/searchIsbn">
        <input type="text" id="isbn" name="isbn" placeholder="Enter ISBN">
        <button type="submit">Search</button>
        </form>
        `,
    });
});

app.get("/searchIsbn", (req, res) => {
    let isbn = req.query.isbn;
    if (!isbn) {
        res.status(500).send("Please enter ISBN");
        return;
    }

    let bookInfo = bookData.find((b) => b.isbn === isbn);
    if (bookInfo) {
        res.render("pages/searchIsbn", { isbnSearchResult: bookInfo });
    } else {
        res.status(500).send("ISBN not found!");
    }
});

// the titleForm sent is not used
app.get("/data/search/title", (req, res) => {
    res.render("pages/searchTitle", {
        titleForm: `
        <form method="GET" action="/searchTitle">
        <input type="text" id="title" name="title" placeholder="Enter Title">
        <button type="submit">Search</button>
        </form>
        `,
    });
});

app.get("/searchTitle", (req, res) => {
    let title = req.query.title;
    if (!title) {
        res.status(500).send("Please enter a book title");
        return;
    }

    let bookInfos = bookData.filter((b) => b.title.includes(title));
    if (bookInfos.length > 0) {
        let content = ``;
        bookInfos.map((bookInfo) => {
            content += `
            <div>
                Book Title: ${bookInfo.title}<br>
                Book Isbn: ${bookInfo.isbn}<br>
                Page Count ${bookInfo.pageCount}
            </div><br>
            `;
        });
        res.render("pages/searchTitle", {
            searchResult: content,
        });
    } else {
        res.status(500).send("Book title not found!");
    }
});

// Step 7
app.get("/allData", (req, res) => {
    res.render("pages/allData", { bookData });
});



app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
