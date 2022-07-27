import express, { request } from "express";
const app = express();
import { Users } from "./users.js";
import cors from "cors";

import axios from "axios";
import pkg from "html2json";

import { pool } from "./db.service.js";

app.use(cors());
app.use(express.json()); // for parsing application/json

app.get("/", (req, res) => {
  const { q } = req.query;

  const keys = ["first_name", "last_name", "email"];

  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(q))
    );
  };

  q ? res.json(search(Users).slice(0, 10)) : res.json(Users.slice(0, 10));
});

app.get("/company/search", async (req, res) => {
  const searchTerm = req.query.q;
  try {
    const response = await axios.post(
      "https://www.zaubacorp.com/custom-search",
      new URLSearchParams({
        search: searchTerm,
        filter: "company",
      })
    );

    // Converting HTML to JSON Object
    const data = pkg.html2json(response.data.trim());

    const searchSet = [];

    // Iterating JSON Object to fetch Company Names
    for (var i = 0, j = 1; i < data["child"].length; i++) {
      if (data["child"][i].node == "element" && data["child"][i].tag == "div") {
        // Splitting CIN
        const companyId = data["child"][i]["attr"]["id"].slice(
          data["child"][i]["attr"]["id"].lastIndexOf("/") + 1,
          data["child"][i]["attr"]["id"].length
        );
        searchSet.push({
          id: j,
          company_name: data["child"][i]["child"][0].text,
          company_id: companyId,
        });
        j++;
      }
    }
    if (searchSet.length == 0) {
      res.json([
        {
          id: 1,
          company_name: "No Company found",
          company_id: "NOTFOUND",
        },
      ]);
    } else {
      res.json(searchSet);
    }
  } catch (e) {
    res.json({
      success: false,
      err: e,
    });
  }
});

app.get("/db", async (req, res) => {
  try {
    await pool.query("SELECT NOW()");
    console.log("DB Connection working.");
    res.json({ success: true });
  } catch (e) {
    res.json({ success: false });
  }
});

app.post("/company/add", async (req, res) => {
  const companyId = req.body.companyId;
  const companyName = req.body.companyName;
  try {
    await pool.query(
      `INSERT INTO company (cid, name) VALUES ('${companyId}', '${companyName}');`
    );
    res.json({
      success: true,
      msg: "Data successfully added",
    });
  } catch (e) {
    console.log(e);
    res.json({
      success: false,
      err: e,
    });
  }
});

app.get("/company/all", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, cid, name FROM company;");
    if (result.rowCount > 0) {
      res.json({
        success: true,
        data: result.rows,
      });
    } else {
      res.json({
        success: true,
        data: [],
        msg: "No data available",
      });
    }
  } catch (e) {
    console.log(e);
    res.json({
      success: false,
      err: e,
    });
  }
});

app.delete("/company/all", async (req, res) => {
  try {
    await pool.query("TRUNCATE company RESTART IDENTITY;");
    res.json({
      success: true,
      msg: "Data deleted",
    });
  } catch (e) {
    console.log(e);
    res.json({
      success: false,
      err: e,
    });
  }
});
app.listen(5000, () => console.log("API is working!"));
