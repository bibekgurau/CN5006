//this code runs with mongoose v7 plus
var express = require("express")
const { default: mongoose } = require("mongoose")
let Books = require('./Schema')
//let mongodbConnected=require('./MongodbConnect')
const connectDB = require('./MongoDBConnect');
const cors = require('cors');
console.log("Server2k25")
var app =express()
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cors());
console.log("BOOKS",Books)
app.get('/',function(req,res){
console.log("this is default")
res.send("This is default")
})
app.get('/about',function (req,res){
res.send("mongodb express React and mongoose app,React runs in anotherapplication")
Books.countDocuments().exec()
 .then(count=>{
 console.log("Total documents Count before addition :", count)


 }) .catch(err => {
 console.error(err)
 })

})
app.get('/allbooksold',function(req,res){
 Books.find(function(err, allbook) {
 if (err) {
 console.log(err);
 } else {

 res.json(allbook);
 }
 });
 });
 app.get('/allbooks',async(req,res)=>{
 const d= await Books.find();
 return res.json(d)
 })
app.get('/getbookold/:id',function(req, res) {
 let id = req.params.id;
 Books.findById(id, function(err, book) {
 console.log("found book"+book)
 res.json(book);
 });
 });
 app.get('/getbook/:id',async(req, res) =>{
 let id = req.params.id;
 book= await Books.findById(id)
 if(book)
 {
 console.log("found book"+book)
 res.json(book);
 }
 else
 {
 console.log("No book found or Error")
 }

 });
app.post('/addbooks', function(req,res)
 {
 console.log("Ref",req.body)
 let newbook = new Books(req.body);
 console.log("newbook->",newbook)
 newbook.save()
 .then(todo => {
 res.status(200).json({'books': 'book added successfully'});
 })
 .catch(err => {
 res.status(400).send('adding new book failed');
 });
})
// Update a book by ID (Mongoose v7+ — async/await, no callbacks)
app.post('/updatebook/:id', async (req, res) => {
 try {
 const id = req.params.id;
 // Optional: whitelist fields to prevent unintended updates
 const update = { 
     booktitle: req.body.booktitle,
 PubYear: req.body.PubYear,
 author: req.body.author,
 Topic: req.body.Topic,
 formate: req.body.formate
 };
 console.log("Update request:", { id, update });
 // Perform the update
 const updatedBook = await Books.findByIdAndUpdate(
 id,
 { $set: update }, // use $set to avoid replacing the whole document
 {
 new: true, // return the updated doc
 runValidators: true, // enforce schema validation on updates
 // omitUndefined: true // optional: ignore fields that are undefined
 }
 );
 if (!updatedBook) {
 return res.status(404).json({ error: 'Book not found' });
 }
 // You can return the updated document or just a message
 return res.status(200).json({
 message: 'Book updated successfully',
 book: updatedBook
 });
 } catch (err) {
 console.error('Update error:', err);
 return res.status(500).json({
 error: 'Failed to update book',
 details: err.message
 });
 }
});
app.post('/deleteBook/:id', async (req, res) => {
 try {
 const id = req.params.id;
 console.log("Deleting book:", id);
 const deletedBook = await Books.findByIdAndDelete(id);
 if (!deletedBook) {
 return res.status(404).json({ error: 'Book not found' });
 }
 res.status(200).send('Book Deleted');
 } catch (err) {
 console.error('Delete error:', err);
 res.status(500).json({ error: 'Failed to delete book', details:
err.message });
 }
});
app.listen(5000,function(){
console.log("Server is running on the port 5000")
})
// (async () => {
//  await connectDB(); // Promise-based connection
//  app.listen(5000, () => console.log('✅ Server running on port 5000'));
// })();