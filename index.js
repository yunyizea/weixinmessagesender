// if exists
import WXMP from "./dist/main.js";

// create WeiXinMessageMainProgram instance
const wxmp = new WXMP({
  appID: "",
  appsecret: "",
});

// init
wxmp
  .init()
  .then((data) => {
    if (data.success) return data;
    else throw new Error(data);
  })
  .then((data) => {
    console.log(data);
    // do smth...
  })
  .catch((err) => {
    console.error(err);
    // do smth...
  });
