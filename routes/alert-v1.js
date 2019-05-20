const express = require("express");
const router = express.Router();
const statusList = Object.getOwnPropertyNames(
  require("./../models/Status").Status
);
let alertModel = undefined;

/* Control usermodel initialisation */
router.use((req, res, next) => {
  if (!alertModel) {
    res.status(500).json({ message: `model not initialised` });
  }
  next();
});

/* GET a specific alert by id */
router.get("/:id", function(req, res, next) {
  const id = req.params.id;
  if (id) {
    try {
      alertModel.get(id, (err, alertFound) => {
        if (alertFound) {
          res.status(200).json({message:'successuf operation'});
        } else {
          res.status(404).json({ message: `alert not found ` });
        }
      });
    } catch (exc) {
      res.status(400).json({ message: exc.message });
    }
  } else {
    res.status(400).json({ message: `Invalid ID supplied` });
  }
});

/* GET an alert with one or multiple status separated by comma */
router.get("/search/:status", (req, res, next) => {
  const status = req.params.status;
  if (status) {
    const tmp = status.split(",");
    const invalidTag = tmp.reduce(
      (accumulateur, current) => accumulateur || !statusList.includes(current),
      false
    );
    if (!invalidTag) {
      alertModel.getFromStatus(tmp, (err, result) => {
        if (err) {
          res.status(404).json({ message: "alert.not.found" });
        } else {
            res.status(200).json({message:'successuf operation'});
        }
      });
    } else {
      res
        .status(400)
        .json({ message: "Invalid tag value" })
        .end();
    }
  } else {
    res
      .status(400)
      .json({
        message: "wrong parameters"
      })
      .end();
  }
});

/* Add a new alert. */
router.post("/", function(req, res, next) {
  const newAlert = req.body;
  if (newAlert) {
      alertModel.add(newAlert, (err, result) => {
        if (err) {
          res.status(405).json({ message: `Invalid input` });
        } else {
            res.status(200).json({message:'successuf operation'});
        }
      });
    }
  else {
    res.status(405).json({ message: `Invalid input` });
  }
});

/* update a specific */
router.patch("/:id", (req, res, next) => {
  const id = req.params.id;
  const newAlertProperties = req.body;
  if (id && newAlertProperties) {
    alertModel.update(id, newAlertProperties, (err, result) => {
      if (err) {
        if (err.message === "alert.not.found")
          res.status(404).json({ message: err.message });
        else {
          res.status(405).json({ message: `Invalid input` });
        }
      } else {
        res.status(200).json({message:'successuf operation'});
      }
    });
  } else {
    res.status(405).json({ message: `Invalid input` });
  }
});

/* REMOVE a specific alert by id */
router.delete("/:id", function(req, res, next) {
  const id = req.params.id;
  if (id) {
    alertModel.remove(id, (err, result) => {
      if (err) {
        res.status(404).json({
          message: "Alert not found"
        });
      } else {
        res.status(200).json({message:'successuf operation'});
      }
    });
  }
  else{
      res.status(400).json({message:'Invalid ID supplied'})
  }
});

/** return a closure to initialize model */
module.exports = model => {
  alertModel = model;
  return router;
};
