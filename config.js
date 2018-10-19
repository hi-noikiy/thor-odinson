module.exports = {
  "dev": {
    "authConnEndpoint": "https://cloud-authconnect.ecnova.com",
    "accountEndpoint": "https://cloud-account.ecnova.com",
    "marketplaceEndpoint": "https://cloud-marketplace.ecnova.com",
    "ssEndpoint": "https://shansong-testing.ecnovaapis.com",
    "baidulbsEndpoint": "https://cloud-baidulbs-testing.ecnova.com",
    "oauth2Conn": "h5_starterkit",
    "wxAuthId": "shansong_wxoauth",
    "smsAuthConn": "36kr_sms",
    "publicId": "36kr_h5",
    "lbs": {
      "token": "vvXFQ0rUvDCjUkUztZtkwFukao8DrZx1",
      "uri": {
        "protocol": 'https',
        "hostname": 'api.map.baidu.com',
      }
    },
  },
  "testing": {
    "authConnEndpoint": "https://cloud-authconnect.ecnova.com",
    "accountEndpoint": "https://cloud-account.ecnova.com",
    "marketplaceEndpoint": "https://cloud-marketplace.ecnova.com",
    "ssEndpoint": "https://shansong-testing.ecnovaapis.com",
    "baidulbsEndpoint": "https://cloud-baidulbs-testing.ecnova.com",
    "oauth2Conn": "h5_starterkit",
    "wxAuthId": "shansong_wxoauth",
    "smsAuthConn": "36kr_sms",
    "publicId": "36kr_h5",
    "lbs": {
      "token": "vvXFQ0rUvDCjUkUztZtkwFukao8DrZx1",
      "uri": {
        "protocol": 'https',
        "hostname": 'api.map.baidu.com',
      }
    },
  },
}[process.env.TRACE || 'dev']
