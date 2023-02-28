#!/usr/bin/env node
const makeEventHubReaderNode = (RED) => {
    const { EventHubConsumerClient, earliestEventPosition } = require("@azure/event-hubs");

  var statusEnum = {
      disconnected: { color: "red", text: "Disconnected" },
      connected: { color: "green", text: "Connected" },
      error: { color: "grey", text: "Error" }
  };

  var setStatus = function (node, status) {
      node.status({ fill: status.color, shape: "dot", text: status.text });
  }

    function ehreader(config) {
        // Bootstrap the node
        RED.nodes.createNode(this, config);
        let node = this;
        setStatus(node, statusEnum.disconnected)
        // Get our values build internally
        const ehConnectionString = node.credentials.eventhub_connection_string;
        const ehHubName = config.eventhub_name
        const ehConsumerGroup = config.eventhub_consumer_group
        if (!ehConnectionString || !ehHubName || !ehConsumerGroup) {
            node.error("Input data not provided.", msg)
        } else {        
            const client = new EventHubConsumerClient(
                ehConsumerGroup,
                ehConnectionString,
                ehHubName
              );         
              const subscriptionOptions = {
                startPosition: earliestEventPosition
                // startPosition: {
                //     'sequenceNumber': earliestEventPosition
                //     }
                };
                const subscription = client.subscribe(
                    {
                      processEvents: async (event_list, context) => {
                        // event processing code goes here
                        for (eh_event in event_list) {
                            msg = {
                              eventhub: ehHubName,
                              consumergroup: ehConsumerGroup
                            }
                            // code block to be executed
                            // console.log()
                            // ehLatestSequence = events[msg].sequenceNumber
                            msg.payload = event_list[eh_event].body;
                            node.send(msg);
                          }
                        
                        // console.log(ehLatestSequence)
                      },
                      processError: async (err, context) => {
                        // error reporting/handling code here
                        node.error(err)
                        setStatus(node, statusEnum.error)
                        // console.log(context)
                      }
                    },
                    subscriptionOptions
                  );
                  setStatus(node, statusEnum.connected);
        };
        node.on('close', function () {
          subscription.close();
          client.close();
          setStatus(node, statusEnum.disconnected);
      });
    };
    RED.nodes.registerType("azure-event-hub-reader", ehreader, {
      credentials: {
        eventhub_connection_string: {type: "password"}
      }
  });
};

module.exports = makeEventHubReaderNode;