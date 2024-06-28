import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import bodyParser from "body-parser"
import * as XLSX from 'xlsx';
import multer from "multer"
import path from "path"
import fs from "fs"
import dotenv from "dotenv";



const router = express.Router();

router.post("/adminlogin", (req, res) => {
    const sql = "SELECT * from admin Where email = ? and password = ?";
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
      if (err) return res.json({ loginStatus: false, Error: "Query error" });
      if (result.length > 0) {
        const email = result[0].email;
        const token = jwt.sign(
          { role: "admin", email: email, id: result[0].id },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1d" }
        );
        res.cookie('token', token)
        return res.json({ loginStatus: true });
      } else {
          return res.json({ loginStatus: false, Error:"wrong email or password" });
      }
    });

    console.log(req.body)
  });

router.post('/add_student', (req, res) => {
    const sql = `INSERT INTO student (reg, name, email, password, CGPA, branch) VALUES (?)`;
    const { reg, name, email, password, CGPA, branch } = req.body;

    if (!reg || !name || !email || !password || !CGPA || !branch) {
        return res.json({ Status: false, Error: "Missing required fields" });
    }

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error("Hashing error:", err);
            return res.json({ Status: false, Error: "Query Error" });
        }
        
        const values = [
            reg,
            name,
            email,
            hash,
            CGPA,
            branch
        ];

        con.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Database query error:", err);
                return res.json({ Status: false, Error: err });
            }
            return res.json({ Status: true });
        });
    });
});

router.get('/student', (req, res) => {
    const sql = `SELECT reg, name, email, CGPA, branch FROM student`;
    con.query(sql, (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.json({ Status: false, Error: err });
        }
        return res.json({ Status: true, Students: results });
    });
});





router.get('/student/branch/:branch', (req, res) => {
    const { branch } = req.params;
    const sql = `SELECT reg, name, email, CGPA, branch FROM student WHERE branch = ?`;
    con.query(sql, [branch], (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.json({ Status: false, Error: err });
        }
        return res.json({ Status: true, Students: results });
    });
});


router.get('/student/CGPA/:cgpa', (req, res) => {
    const { cgpa } = req.params;
    const sql = `SELECT reg, name, email, CGPA, branch FROM student WHERE cgpa >= ?`;
    con.query(sql, [cgpa], (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.json({ Status: false, Error: err });
        }
        return res.json({ Status: true, Students: results });
    });
});

router.post('/add_company', (req, res) => {
    const sql = `INSERT INTO company (name, description, eligible_cgpa, status) VALUES (?)`;
    const { name, description, eligible_cgpa, status } = req.body;

    if (!name || !description || !eligible_cgpa || !status) {
        return res.json({ Status: false, Error: "Missing required fields" });
    }

    const values = [
        name,
        description,
        eligible_cgpa,
        status
    ];

    con.query(sql, [values], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return res.json({ Status: false, Error: err });
        }
        return res.json({ Status: true });
    });
});

// Endpoint to get all companies
router.get('/company', (req, res) => {
    const sql = `SELECT name, description, eligible_cgpa, status FROM company`;
    con.query(sql, (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.json({ Status: false, Error: err });
        }
        return res.json({ Status: true, Companies: results });
    });
});

// Endpoint to get active companies
router.get('/active_companies', (req, res) => {
    const sql = `SELECT name FROM company WHERE status = 'active'`;
    con.query(sql, (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.json({ Status: false, Error: err });
        }
        return res.json({ Status: true, Companies: results });
    });
});

router.post('/filter_students', (req, res) => {
    const { cgpa, branch } = req.body;
    const sql = `SELECT * FROM student WHERE CGPA >= ? AND branch = ?`;
    con.query(sql, [cgpa, branch], (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.json({ Status: false, Error: err });
        }
        return res.json({ Status: true, Students: results });
    });
});

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD // replace with your app password
    }
  });


router.post('/send_emails', (req, res) => {
    const { students, subject, message } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        subject: subject,
        text: message
    };

    let emailPromises = students.map(student => {
        return transporter.sendMail({
            ...mailOptions,
            to: student.email,
            text: `Dear ${student.name},\n\n${message}`
        });
    });

    Promise.all(emailPromises)
        .then(() => res.json({ Status: true, Message: 'Emails sent successfully!' }))
        .catch(err => res.json({ Status: false, Error: err.message }));
});


// Add this route to your backend
router.post('/update_students', (req, res) => {
    const companyName = req.body.companyName;

    const addColumnQuery = `ALTER TABLE student ADD COLUMN ${companyName}_firstround BOOLEAN DEFAULT FALSE`;
    const updateStudentsQuery = `UPDATE student SET ${companyName}_firstround = TRUE WHERE branch = ? AND CGPA >= ?`;

    // Execute the queries
    con.query(addColumnQuery, (err, result) => {
        if (err) {
            return res.json({ Status: false, Error: err.message });
        }
        // Assuming cgpa and branch are passed in the request body
        const { cgpa, branch } = req.body;
        con.query(updateStudentsQuery, [branch, cgpa], (err, result) => {
            if (err) {
                return res.json({ Status: false, Error: err.message });
            }
            res.json({ Status: true });
        });
    });
});


router.post('/get_students_by_column', (req, res) => {
    const { companyName, roundName } = req.body;
    const columnName = `${companyName}_${roundName}`;

    const query = `SELECT name, email FROM student WHERE ${columnName} = TRUE`;

    con.query(query, (err, results) => {
        if (err) {
            return res.json({ Status: false, Error: err.message });
        }
        res.json({ Status: true, Students: results });
    });
});
router.post('/get_columns', (req, res) => {
    const { companyName } = req.body;
    const likePattern = `${companyName}_%`;

    const query = `
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME='student' AND COLUMN_NAME LIKE ?
    `;

    con.query(query, [likePattern], (err, results) => {
        if (err) {
            return res.json({ Status: false, Error: err.message });
        }

        const columns = results.map(row => row.COLUMN_NAME.split(`${companyName}_`)[1]);
        res.json({ Status: true, Columns: columns });
    });
});




const upload = multer({ dest: 'uploads/' });

router.post('/alter_student_table', upload.single('file'), (req, res) => {
    const { companyName, roundName } = req.body;
    const filePath = req.file.path;

    if (!companyName || !roundName) {
        return res.status(400).json({ error: 'Company name and round name are required' });
    }

    const columnName = `${companyName}_${roundName}`;
    const addColumnQuery = `ALTER TABLE student ADD COLUMN ${columnName} BOOLEAN DEFAULT FALSE`;

    con.query(addColumnQuery, (err, result) => {
        if (err) {
            if (err.code !== 'ER_DUP_FIELDNAME') {
                return res.status(500).json({ error: 'Error altering student table' });
            }
        }

        fs.readFile(filePath, (err, data) => {
            if (err) {
                return res.status(500).json({ error: 'Error reading uploaded file' });
            }

            const workbook = XLSX.read(data, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            const emailList = jsonData.map(row => row.Email);

            const updateQuery = `UPDATE student SET ${columnName} = TRUE WHERE email IN (?)`;
            con.query(updateQuery, [emailList], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Error updating student table' });
                }
                res.json({ status: 'success', message: 'Student table updated successfully' });
            });
        });
    });
});

router.post('/finish_drive', (req, res) => {
    const { companyName } = req.body;

    const updateCompanyStatusQuery = `
        UPDATE company 
        SET status = 'inactive' 
        WHERE name = ?
    `;

    con.query(updateCompanyStatusQuery, [companyName], (err, result) => {
        if (err) {
            return res.json({ Status: false, Error: err.message });
        }
        res.json({ Status: true, Message: 'Company status updated to inactive' });
    });
});


router.get('/company_status_counts', (req, res) => {
    const query = `
        SELECT status, COUNT(*) AS companyCount
        FROM company
        GROUP BY status
    `;

    con.query(query, (err, results) => {
        if (err) {
            return res.json({ Status: false, Error: err.message });
        }

        const counts = {
            activeCount: 0,
            inactiveCount: 0
        };

        results.forEach(row => {
            if (row.status === 'active') {
                counts.activeCount = row.companyCount;
            } else if (row.status === 'inactive') {
                counts.inactiveCount = row.companyCount;
            }
        });

        res.json({ Status: true, CompanyStatusCounts: counts });
    });
});

router.get('/branch_counts', (req, res) => {
    const query = `
        SELECT branch, COUNT(*) AS studentCount
        FROM student
        GROUP BY branch
    `;

    con.query(query, (err, results) => {
        if (err) {
            return res.json({ Status: false, Error: err.message });
        }

        if (results.length > 0) {
            res.json({ Status: true, BranchCounts: results });
        } else {
            res.json({ Status: false, Error: 'No data found' });
        }
    });
});



router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
})





export {router as adminRouter}