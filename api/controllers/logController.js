const mongoose = require("mongoose");
const Log = mongoose.model("Log");

exports.listAllLogs = (req, res) => {
  Log.find({}, (err, logs) => {
    if (err) res.send(err);
    res.json(logs);
  });
};

exports.createALog = (req, res) => {
  const newLog = new Log(req.body);
  newLog.save((err, log) => {
    if (err) res.send(err);
    res.json(log);
  });
};

exports.readALog = (req, res) => {
  Log.findById(req.params.logId, (err, log) => {
    if (err) res.send(err);
    res.json(log);
  });
};

exports.updateALog = () => {
  Log.findOneAndUpdate(
    { _id: req.params.logId },
    req.body,
    { new: true },
    (err, log) => {
      if (err) res.send(err);
      res.json(log);
    }
  );
};

exports.deleteALog = (req, res) => {
  Log.deleteOne({ _id: req.params.logId }, (err) => {
    if (err) res.send(err);
    res.json({
      message: "Log deleted",
      _id: req.params.logId
    });
  });
};
