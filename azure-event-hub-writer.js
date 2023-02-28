#!/usr/bin/env node
const makeEventHubWriterNode = (RED) => {
  const { EventHubProducerClient, EventHubConsumerClient } = require("@azure/event-hubs");

  var statusEnum = {
      disconnected: { color: "red", text: "Disconnected" },
      connected: { color: "green", text: "Connected" },
      error: { color: "grey", text: "Error" }
  };

  var setStatus = function (node, status) {
      node.status({ fill: status.color, shape: "dot", text: status.text });
  }

    function ehwriter(config) {
        // Bootstrap the node
        RED.nodes.createNode(this, config);
        let node = this;
        setStatus(node, statusEnum.disconnected)
        // Get our values build internally
        const ehConnectionString = node.credentials.eventhub_connection_string;
        const ehHubName = config.eventhub_name
        if (!ehConnectionString || !ehHubName ) {
            node.error("Input data not provided.", msg)
        } else {        
          const client = new EventHubProducerClient(
              ehConnectionString,
              ehHubName
            );         
            setStatus(node, statusEnum.connected)
            node.on('input', async function (msg) {
              console.log(msg)
              const eventDataBatch = await client.createBatch();
              var messageJSON = null;
              if (typeof (msg.payload) != "string") {
                node.log("JSON");
                messageJSON = msg.payload;
              } else {
                node.log("String");
                //Converting string to JSON Object
                //Sample string: {"deviceId": "name", "key": "jsadhjahdue7230-=13", "protocol": "amqp", "data": "25"}
                messageJSON = JSON.parse(msg.payload);

                
              }
              await eventDataBatch.tryAdd(messageJSON);
              await client.sendBatch(eventDataBatch);

            });
              
        };
        node.on('close', function () {
          client.close();
          setStatus(node, statusEnum.disconnected);
      });
    };
    RED.nodes.registerType("azure-event-hub-writer", ehwriter, {
      credentials: {
        eventhub_connection_string: {type: "password"}
      }
  });
};

module.exports = makeEventHubWriterNode;