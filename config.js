module.exports = {
  "dev": {
    "authConnEndpoint": "https://authconnect-testing.ecnovaapis.com",
    "accountEndpoint": "https://cloud-account-testing.ecnova.com",
    "marketplaceEndpoint": "https://cloud-marketplace-testing.ecnova.com",
    "ssEndpoint": "https://shansong-testing.ecnovaapis.com",
    "baidulbsEndpoint": "https://cloud-baidulbs-testing.ecnova.com",
    "oauth2Conn": "h5_starterkit",
    "wxAuthId": "shansong_wxoauth",
    "smsAuthConn": "shansong_dev",
    "publicId": "shansong_dev",
    "lbs": {
      "token": "vvXFQ0rUvDCjUkUztZtkwFukao8DrZx1",
      "uri": {
        "protocol": 'https',
        "hostname": 'api.map.baidu.com',
      }
    },
  },
  "testing": {
    "authConnEndpoint": "https://cloud-authconnect-testing.ecnova.com",
    "accountEndpoint": "https://cloud-account-testing.ecnova.com",
    "marketplaceEndpoint": "https://cloud-marketplace-testing.ecnova.com",
    "ssEndpoint": "https://cloud-shansong-testing.ecnova.com",
    "baidulbsEndpoint": "https://cloud-baidulbs-testing.ecnova.com",
    "oauth2Conn": "shansong_testing",
    "wxAuthId": "shansong_wxoauth",
    "smsAuthConn": "shansong_dev",
    "publicId": "shansong_dev",
    "lbs": {
      "token": "vvXFQ0rUvDCjUkUztZtkwFukao8DrZx1",
      "uri": {
        "protocol": 'https',
        "hostname": 'api.map.baidu.com',
      }
    },
  },
}[process.env.TRACE || 'dev']
