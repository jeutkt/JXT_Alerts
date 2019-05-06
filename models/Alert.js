const Category = require("./Category");
const Status = require("./Status");
const uuidv1 = require("uuid/v1");
const mongoose = require("mongoose");
const host = require("./../config/connect").host;

alertSchema = mongoose.Schema({
  id: String,
  type: { type: Category, required: true },
  label: { type: String, required: true },
  status: { type: Status, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true }
});
mongoose.set('useFindAndModify', false);
mongoose.connect(host, { useNewUrlParser: true });

const Alerts = mongoose.model("Alerts", alertSchema);

const add = (alert, callback) => {
  const newAlert = {
    ...alert,
    id: uuidv1()
  };
  new Alerts(newAlert).save(err => {
    if (err) {
      callback(err, null);
    } else {
      console.log("saved");
      callback(null, newAlert);
    }
  });
};

const getFromStatus = (mystatus,callback) => {
 Alerts.find({status:{$in:mystatus}},(err,alert)=>{
 err?callback(err,null):callback(null,alert)

 })
};
const get = (alertId, callback) => {
  Alerts.find({ id: alertId }, (err, alert) => {
      err ? callback(err, null) : callback(null, alert);
  });
};

const update = (alertId, newalert, callback) => {
  Alerts.findOneAndUpdate(
    { id: alertId },
    newalert,
    { new: true },
    (err, alert) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, alert);
      }
    }
  );
};

const remove = (alertId, callback) => {
  Alerts.findOneAndDelete({ id: alertId }, (err, alert) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, alert);
    }
  });
};

module.exports.add = add;
module.exports.get = get;
module.exports.update = update;
module.exports.getFromStatus = getFromStatus;
module.exports.remove = remove;
