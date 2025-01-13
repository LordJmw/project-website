const express = require("express");
const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const axios = require("axios")

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "uasdatabase",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended : true}))
app.use(cors())


app.get("/",(req,res) => {
    let sql = `select x.product_name,x.note, x.description, x.quantity, x.product_id, x.store_id, x.isChecked , y.store_image_link, y.store_name, x.product_price, x.product_image_link, x.discount from products as x join store as y
    on x.store_id = y.store_id`
    pool.query(sql,(err,results) => {
        if(err){return res.status(500).json({error : "internal server error"})}
        res.status(200).json({
            error : false,
            status : 200,
            response : results
        })
    })
})

app.get("/cart",(req,res) => {
  res.sendFile(path.join(__dirname,"./../public/html/cart.html"), (err) => {
    if(err){
      console.log("error reading file")
    }
  })
})

app.get("/check-out",(req,res) => {
  res.sendFile(path.join(__dirname, "./../public/html/checkout.html"), (err) => {
    if(err){console.log("error reading file")}
  })
})
    
app.get("/databaseBackup",(req,res) => {
  res.sendFile(path.join(__dirname,"./../public/assets/databaseProduk.sql"))
})

app.get("/reload", async (req, res) => {
  const tempFilePath = '/tmp/databaseProduk.sql'
  const response = await axios.get("https://websites-projects.vercel.app/databaseBackup")
  fs.writeFileSync(tempFilePath, response.data, 'utf8');
  
  const sqlDump = fs.readFileSync(tempFilePath, 'utf8');
  // ;split titik koma sebagai end dari sql statement, \s* artinya whitespace(spasi kosong setelah titik koma, $memastikan ; di akhir 
  // kalimat
  const queries = sqlDump.split(/;\s*$/m).filter(query => query.trim() !== '');

  console.log(`SQL Dump loaded from: ${sqlUrl}`);

  try {
    // Execute SQL dump
    for (const query of queries) {
      await pool.promise().query(query);
      console.log(`Executed: ${query}`);
    }

    res.status(200).json({
      error: false,
      status: 200,
      message: "Database reloaded successfully!",
    });
  } catch (err) {
    console.error("Query problem:", err.message);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});

app.put("/products/:id", (req,res) => {
    const id = req.params.id
    console.log(req.body.isChecked,id)
    const {isChecked, quantity } = req.body
    let sql = `update products set isChecked = ? , quantity = ? where product_id = ?`
    pool.query(sql, [isChecked, quantity, id] ,(err,results) => {
        if(err){return res.status(500).json({error : "internal server error"})}
        res.status(200).json({
            error : false,
            status : 200,
            response : results
        })
    })
})


app.put("/store/:id" , (req,res) => {
    const id = req.params.id
    const { isChecked, infos } = req.body
    let sql = `update products set ` 

    let qtyCases = []
    let isCheckedCases = []
    let ids = []

    infos.forEach(info => {
        qtyCases.push(`when product_id = ${info.id} then ${info.qty}`)
        isCheckedCases.push(`when product_id = ${info.id} then ${isChecked}`)
        ids.push(info.id)
    })

    sql += `quantity = case ${qtyCases.join(" ")} end,`
    sql += `isChecked = case ${isCheckedCases.join(" ") } end `
    sql += `where product_id in (${ids.join(",")}) and store_id = ?`

    pool.query(sql,[id],(err,results) => {
        if(err){
            return res.status(500).json({error : sql})
        }
        if(results.affectedRows == 0){
          return res.status(404).json({
            status : 404,
            info : `can't found store_id ${id} or product_id`
          })
        }
        if(results.affectedRows > 0 && results.affectedRows != ids.length ){
          return res.status(404).json({
            status : 404,
            info : "product_id can't be found"
          })
        }
        res.status(200).json({
            error : false,
            status : 200,
            response : results
        })
    })
})

app.put("/allStores",(req,res)=>{
    const { isChecked, infos } = req.body
    let sql = `update products set ` 

    let qtyCases = []
    let isCheckedCases = []
    let ids = []

    infos.forEach(info => {
        qtyCases.push(`when product_id = ${info.id} then ${info.qty}`)
        isCheckedCases.push(`when product_id = ${info.id} then ${isChecked}`)
        ids.push(info.id)
    })

    sql += `quantity = case ${qtyCases.join(" ")} end,`
    sql += `isChecked = case ${isCheckedCases.join(" ") } end `
    sql += `where product_id in (${ids.join(",")})`

    pool.query(sql,(err,results) => {
        if(err){
            return res.status(500).json({error : sql})
        }
        res.status(200).json({
            error : false,
            status : 200,
            response : results
        })
    })
})

app.put("/product/note/:id",(req,res) => {
  const id = req.params.id
  const {note} = req.body
  let sql = `update products set note = ? where product_id = ?`
  let getSql = `select product_id,note from products where product_id = ?`
  // if(!note){
  //   return res.status(400).json({error : "note required", status : 400})
  // }
  pool.query(sql, [note,id] ,(err,results) => {
    if(err){return res.status(500).json({error : "internal server error"})}
    pool.query(getSql, [id], (err,results1) => {
      if(err){
        return res.status(500).json({error : "internal server error"})
      }
      res.status(200).json({
        error : 0,
        status : 200,
        response : results1
      })
    })
  })
})

app.post("/get-product-info", async (req, res) => {
  let { ids } = req.body;
  
  try {
    let results = [];

    for (let id of ids) {
      let sql = `SELECT * FROM products AS p JOIN store AS s ON p.store_id = s.store_id WHERE product_id = ?`;
      
      const rows = await new Promise((resolve, reject) => {
        pool.query(sql, [id], (err, results) => {
          if (err) {
            console.log("SQL Error:", err);  
            reject(err);  
          } else {
            resolve(results);  
          }
        });
      });

      results.push(...rows);
    }
    // console.log(results)
    res.status(200).json({
      error: 0,
      data: results
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.delete("/products/:id", (req, res) => {
    const id = req.params.id;
  
    const sql = "DELETE FROM products WHERE product_id = ?";
    pool.query(sql, [id], (err, results) => {
      if (err) {
        console.error("Error deleting product:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(200).json({
        error: false,
        status: 200,
        message: "Product deleted successfully",
        response: results
      });
    });
  });
  
app.delete("/products/store/:store_id", (req, res) => {
  const storeId = req.params.store_id;

  const sql = "DELETE FROM products WHERE store_id = ?";
  pool.query(sql, [storeId], (err, results) => {
    if (err) {
      console.error("Error deleting products by store:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).json({
      error: false,
      status: 200,
      message: "Products from the store deleted successfully",
      response: results
    });
  });
});


module.exports = app