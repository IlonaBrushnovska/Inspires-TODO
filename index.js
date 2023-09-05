import express from "express";
import bodyParser from "body-parser";
import fs from "fs";


const app = express();
const port = 3000;
const listOftasks = [];
var isCreatedFile = false;


// Create a date of today.
const today = new Date();
const year = today.getFullYear();
const monthNum = today.getMonth() + 1; // Month is 0-based, so add 1
const numDay = today.getDate();

// Format month with leading zero if needed
const month = (monthNum < 10) ? `0${monthNum}` : `${monthNum}`;

// Format day with leading zero if needed
const day = (numDay < 10) ? `0${numDay}` : `${numDay}`;

const thisDay = `${year}-${month}-${day}`;
console.log(thisDay);

app.use(express.static("public"))

app.use(bodyParser.urlencoded({ extended: true }));

// Create a file with tasks which date equal today's date.

function createFile(req, res, next) { 
if (req.body["date"] === thisDay) {
  fs.writeFile("today.txt", `${listOftasks}`, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
    isCreatedFile = true;
  });
}
  next();
}

app.use(createFile)

//Get to the starting page.
app.get("/", (req, res) => {
  res.render("index.ejs")
});

app.post("/submit", (req, res) => {

  // Take a data from a form and create a list of tasks below the form.
    const userTask =  req.body["date"] + " " + req.body["task"];
    listOftasks.push(userTask);
   
    res.render("index.ejs", {
    taskCreated: userTask,
    allTasks: listOftasks,
 });
});

// Show tasks from file "today.txt" on a /today page.

app.get("/today", (req, res) => {
 if (isCreatedFile) {
  fs.readFile("today.txt", "utf8", (err, data) => {
    if (err) {
      throw err;
    }
    const tasks = data.split(',');
    
    res.render("today.ejs", {
      listOfQuotes: randomQuoteText,
      showTasks: tasks,
  }); 
  });
} else {const tasks = [];
   
  res.render("today.ejs", {
    showTasks: tasks,
    listOfQuotes:randomQuoteText,
});
}
});


app.get("/done", (req, res) => {
  const tasks = []
  res.render("completed.ejs", {
    showCompletedTasks: tasks,
});
});

// Shows completed tasks on /completed page aftes pressing "DONE" on today's page.

app.post("/done", (req, res) => {

  if (isCreatedFile) {
  fs.readFile("today.txt", "utf8", (err, data) => {
    if (err) {
      throw err;
    }
    
    const tasks = data.split(','); 
    res.render("completed.ejs", {
      showCompletedTasks: tasks,
  });      
  });
} 
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});


var quotes = ["Focus on being productive instead of busy. -Tim Ferriss",
"If you spend too much time thinking about a thing, you'll never get it done. -Bruce Lee",
"Once you have mastered time, you will understand how true it is that most people overestimate what they can accomplish in a year-and underestimate what they can achieve in a decade! -Tony Robbins",
"There is no substitute for hard work. -Thomas Edison",
"What looks like multitasking is really switching back and forth between multiple tasks, which reduces productivity and increases mistakes by up to 50%. -Susan Cain",
"Don't worry about breaks every 20 minutes ruining your focus on a task. Contrary to what I might have guessed, taking regular breaks from mental tasks actually improves your creativity and productivity. Skipping breaks, on the other hand, leads to stress and fatigue.-Tom realpath",
"I always had the uncomfortable feeling that if I wasn't sitting in front of a computer typing, I was wasting my time -- but I pushed myself to take a wider view of what was 'productive.' Time spent with my family and friends was never wasted. -Gretchen Rubin",
"Simplicity boils down to two steps: Identify the essential. Eliminate the rest. -Leo Babauta",
"Tomorrow’ is the thing that’s always coming but never arrives. ‘Today’ is the thing that’s already here and never leaves. And because that’s the case, I would much prefer to invest in today than sit around waiting for an arrival that’s not arriving. -Craig D. Lounsbrough",
"Those who seize the day become seriously rich. -Richard Koch, author of The 80/20 Principle: The Secret to Achieving More with Less",
"Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work. And the only way to do great work is to love what you do. If you haven’t found it yet, keep looking. Don’t settle. As with all matters of the heart, you’ll know when you find it. -Steve Jobs",
"Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort. -Paul J. Meyer",
"Stressing output is the key to improving to productivity, while looking to increase activity can result in just the opposite. -Andrew Grove",
"If you commit to giving more time than you have to spend, you will constantly be running from time debt collectors. -Elizabeth Grace Saunders",
"Life is too complicated not to be orderly. -Martha Stewart",
"My goal is no longer to get more done, but rather to have less to do. -Francine Jay",
"Never mistake motion for action. -Ernest Hemingway",
"Always deliver more than expected. -Larry Page",
"If you don’t have daily objectives, you qualify as a dreamer. -Zig Ziglar",
"I feel that luck is preparation meeting opportunity. -Oprah Winfrey",
"Efficiency is doing things right. Effectiveness is doing the right things. -Peter Drucker",
"Lost time is never found again. -Benjamin Franklin",
"While one person hesitates because he feels inferior, the other is busy making mistakes and becoming superior. –Henry C. Link"]

// Takes a random quote from quotes array.
const randomQuote = Math.floor(Math.random() * (quotes.length))
const randomQuoteText = quotes[randomQuote];