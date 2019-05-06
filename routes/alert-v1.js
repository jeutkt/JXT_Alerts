const express = require("express");
const router = express.Router();

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
          res.status(200).json(alertFound);
        } else {
          res.status(404).json({ message: `alert not found with id ${id}` });
        }
      });
    } catch (exc) {
      res.status(400).json({ message: exc.message });
    }
  } else {
    res.status(400).json({ message: `Wrong parameter` });
  }
});


/* GET an alert with one or multiple status separated by comma */
router.get("/search/:status",(req,res,next)=>{
    const status=req.params.status
    if(status){
        const tmp=status.split(",")
        alertModel.getFromStatus(tmp,(err,result)=>{
            if(err || result.length<1){
                res.status(404).json({message:"alert.not.found"})  
            }
            else{
                res.status(200).json(result)
            }   
            })
    }
})

/* Add a new alert. */
router.post("/", function(req, res, next) {
  const newAlert = req.body;
  if (newAlert) {
    try {
      alertModel.add(newAlert, (err, result) => {
        if (err) {
          res.status(400).json({ message: err.message });
        } else {
          res.status(201).send(result);
        }
      });
    } catch (exc) {
      res.status(400).json({ message: exc.message });
    }
  } else {
    res.status(400).json({ message: `Wrong parameters` });
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
            res.status(400).json({ message: err.message });
          }
        } else {
          res.status(200).json(result).end();
        }
      });
    } else {
      res.status(400).json({ message: `Wrong parameter` });
    }
  
});

/* REMOVE a specific alert by id */
router.delete("/:id", function(req, res, next) {
    const id = req.params.id;
    if(id){
        alertModel.remove(id,(err,result)=>{
            if(err){
                res.status(404).json({
                    message:err.message
                })
            }
            else{
                res.status(200).json(result).end()
            }
        })
    }
});

/** return a closure to initialize model */
module.exports = model => {
  alertModel = model;
  return router;
};
