const debug = 1; //0：线上  1：线下 
var config = {
  // code: '',
  // model: ''
};

switch (debug) {
  case 0:
    config.server_domain = "http://193.112.206.66:801/API/";
    config.image_url = "";
    break;
  case 1:
    config.server_domain = "http://193.112.206.66:801/";
    config.image_url = "";
    break;
}

module.exports = {
  config: config,
  debug: debug,
  version_code: "3.0",
  version_number: 2,
};