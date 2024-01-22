const z = require("zod");
const userCreds = z.object({
  username: z.string(),
  password: z.string().min(8),
});
module.exports = {
  userCreds: userCreds,
};
