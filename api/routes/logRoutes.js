const logController = require("../controllers/logController");

module.exports = (app) => {
  app
    .route("/logs")
    .get(logController.listAllLogs)
    .post(logController.createALog);

  app
    .route("/logs/:logId")
    .get(logController.readALog)
    .put(logController.updateALog)
    .delete(logController.deleteALog);
};
