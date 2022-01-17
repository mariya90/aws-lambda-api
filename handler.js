'use strict';

const AWS = require('aws-sdk');
const guid = require('uuid');

module.exports.log_event = async event => {
  const dynamo = new AWS.DynamoDB.DocumentClient();
  let responseBody = "";
  let statusCode = 0;

  let Item = event.queryStringParameters;

  if (Item == null || !Item.hasOwnProperty("time_stamp") || !Item.hasOwnProperty("correlation_id") ||
    !Item.hasOwnProperty("device_fringerprint") || !Item.hasOwnProperty("service_id") ||
    !Item.hasOwnProperty("event_template_id") || !Item.hasOwnProperty("message")) {
    return {
      statusCode: 401,
      headers: {
        "Content-Type": "application/json"
      },
      body: "Input Data invalid"
    };
  }

  Item.event_id = guid.v4();

  const params = {
    TableName: "events",
    Item: Item
  };

  try {
    const data = await dynamo.put(params).promise();
    data.state = "OK";
    responseBody = JSON.stringify(data);
    statusCode = 200;
  } catch (err) {
    responseBody = `Unable to put event: ${err}`;
    statusCode = 400;
  };

  const response = {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: responseBody
  }

  return response;
};

module.exports.get_correlationID = async event => {
  const dynamo = new AWS.DynamoDB.DocumentClient();
  let responseBody = "";
  let statusCode = 0;

  let Item = { id: guid.v4() };

  const params = {
    TableName: "correlations",
    Item: Item
  };

  try {
    const data = await dynamo.put(params).promise();
    responseBody = JSON.stringify(Item);
    statusCode = 200;
  } catch (err) {
    responseBody = `Unable to put event: ${err}`;
    statusCode = 400;
  };

  const response = {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: responseBody
  }

  return response;
};