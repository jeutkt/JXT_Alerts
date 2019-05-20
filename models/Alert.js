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
mongoose.set("useFindAndModify", false);
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
      callback(null, newAlert);
    }
  });
};

const getFromStatus = (mystatus, callback) => {
  console.log(mystatus);
  Alerts.find({ status: { $in: mystatus } }, (err, alert) => {
    alert && alert.length > 1 ? callback(null, alert) : callback(err, null);
  });
};
const get = (alertId, callback) => {
  Alerts.find({ id: alertId }, (err, alert) => {
    alert && alert.length > 0 ? callback(null, alert) : callback(err, null);
  });
};

const update = (alertId, newalert, callback) => {

  const checkattributes = Object
  .getOwnPropertyNames(newalert)
    .reduce(
      (accumulateur, current) =>
        accumulateur || !Alerts.schema.paths.hasOwnProperty(current),
      false
    );
  if (!checkattributes) {
    Alerts.findOneAndUpdate(
      { id: alertId },
      newalert,
      { new: true },
      (err, alert) => {
        if (err) {
          callback(err, null);
        } else {
          alert
            ? callback(null, alert)
            : callback(new Error("alert.not.found"), null);
        }
      }
    );
  } else {
    callback(new Error("wrong.attribute"), null);
  }
};

const remove = (alertId, callback) => {
  Alerts.findOneAndDelete({ id: alertId }, (err, alert) => {
    if (err) {
      callback(err, null);
    } else {
      alert
        ? callback(null, alert)
        : callback(new Error("alert.not.found"), null);
    }
  });
};

module.exports.add = add;
module.exports.get = get;
module.exports.update = update;
module.exports.getFromStatus = getFromStatus;
module.exports.remove = remove;
