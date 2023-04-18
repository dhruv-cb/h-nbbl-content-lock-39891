const sequelize=require("../config/db");
module.exports=(async () => {
  await sequelize.sync();
})();