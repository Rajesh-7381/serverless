const User = require("./jobs/user");
const Profile = require("./jobs/profile");

Profile.belongsTo(User, { foreignKey: "user_id" });
