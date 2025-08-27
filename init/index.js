const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");
const user = require("../models/user.js");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
.then(() => {
  console.log("connected to DB");
})
.catch((err) => {
  console.log(err);
});

const initDB = async () => {
  // to intialize admin - control over all initial listings
  await user.deleteOne({username: 'admin123'});
  const admin = new user({
    email: 'admin123@gmail.com',
    username: 'admin123',
  });
  await user.register(admin, '@ad12');
  let adminId = await user.findOne({username: 'admin123'});
  await listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({...obj, owner: adminId._id}));
  await listing.insertMany(initData.data);
  console.log("data was initialized");
};
initDB();
