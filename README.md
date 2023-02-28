# Node Red custom EventHub reader / writer

This is a basic implementation of a node red reader and writer that can integrate with azure event hubs

*This is in active development and is not stable*

### Warnings
* The reader currently does not process the checkpoint in any fashion so all records are read every time the connection is deployed
    * The intention is to use the node state with a file back storage to maintain the offset
* The reader expects a field called "body" to be present on the records it returns to write them to the message
* The writer either expects a JSON payload or a string that can be parsed as JSON

## Reader

Requires 3 different variables
* Eventhub Connection String - Secret - Used to connect to the eventhub
* Eventhub Name - Text - Name of the hub to connect to within the name space
* Eventhub Consumer Group - Text - Consumer group to use for the connection

## Writer

Requires 2 different variables
* Eventhub Connection String - Secret - Used to connect to the eventhub
* Eventhub Name - Text - Name of the hub to connect to within the name space


## TODO
* [ ] Add error handling and clean up expectations
* [ ] Remove JSON / string JSON requirements from writer
* [ ] Remove requirement of "body" element in Reader