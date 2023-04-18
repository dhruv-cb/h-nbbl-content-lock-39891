const express = require("express");
const checkAuth = require("../middleware/check-auth");
const Student = require("../models/student");
const { Op } = require("sequelize");
const router = express.Router();

router.get("/", checkAuth, (req, res) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  let studentQuery = Student.findAll({ order: [["rollNo"]] });
  if (pageSize && currentPage) {
    studentQuery = Student.findAll({
      order: [["rollNo", "asc"]],
      offset: pageSize * (currentPage - 1),
      limit: pageSize,
    });
  }
  studentQuery
    .then(async (data) => {
      return {
        data: data,
        count: await Student.count().then((res) => {
          return res;
        }),
      };
    })
    .then((obj) => {
      console.log("count", obj);
      res.status(200).json({
        msg: "Students Fetched Successfully!",
        data: obj.data,
        maxStudents: obj.count,
      });
    })
    .catch((err) => {
      res.status(500).json({
        msg: "Internal Server Error!",
      });
    });
});

router.post("/", checkAuth, async (req, res) => {
  if (req.body.score) req.body.score = Math.round(req.body.score);
  if (req.body.dob) req.body.dob = new Date(req.body.dob);
  Student.create(req.body)
    .then((result) => {
      result.save();
      res.status(201).json({
        msg: "Student added Successfully!",
        studentId: result.id,
      });
    })
    .catch((err) => {
      console.log(err.errors[0].message);
      res.status(400).json({
        msg: err.errors[0].message,
      });
    });
});

router.get("/:id", checkAuth, (req, res) => {
  Student.findOne({ where: { id: req.params.id } })
    .then((result) => {
      if (result != null) {
        return res.status(200).json({
          msg: "Student Found",
          data: result,
        });
      }
      res.status(404).json({
        msg: "Not Found!",
      });
    })
    .catch((err) => {
      res.status(500).json({
        msg: "Internal Server Error!",
      });
    });
});

router.post("/find", (req, res) => {
  if (req.body.rollNo === undefined || req.body.dob === undefined) {
    return res.status(404).json({
      msg: "DOB or Roll No. missing!",
    });
  }
  console.log(req.body.toString());
  Student.findOne({
    where: {
      [Op.and]: [{ rollNo: req.body.rollNo }, { dob: new Date(req.body.dob) }],
    },
  })
    .then((result) => {
      if (result) {
        return res.status(200).json({
          msg: "Student Found",
          data: result,
        });
      } else {
        return res.status(404).json({
          msg: "No Match Found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        msg: err.toString(),
      });
    });
});

router.delete("/:id", checkAuth, (req, res) => {
  Student.destroy({ where: { id: req.params.id } })
    .then((result) => {
      console.log(result);
      res.status(200).json({
        msg: "Student Deleted Successfully",
      });
    })
    .catch(() => {
      res.status(404).json({
        msg: "Student not Found",
      });
    });
});

router.patch("/:id", checkAuth, (req, res) => {
  if (req.body.score) req.body.score = Math.round(req.body.score);
  if (req.body.dob) req.body.dob = new Date(req.body.dob);

  Student.update(req.body, { where: { id: req.params.id } })
    .then((result) => {
      res.status(201).json({
        msg: "Student Updated Successfully!",
      });
    })
    .catch((err) => {
      res.status(500).json({
        msg: "Internal Server Error!",
      });
    });
});
module.exports = router;