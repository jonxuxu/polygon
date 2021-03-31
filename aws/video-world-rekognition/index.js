exports.handler = async (event, context) => {
  const message = event.Records[0].Sns.Message;
  const logger = context.logger;

  console.log("Message received from SNS:", message);

  // Parse SNS event for analysis results. Log results
  //   try {
  //     ObjectMapper operationResultMapper = new ObjectMapper();
  //     JsonNode jsonResultTree = operationResultMapper.readTree(message);
  //     logger.log("Rekognition Video Operation:=========================");
  //     logger.log("Job id: " + jsonResultTree.get("JobId"));
  //     logger.log("Status : " + jsonResultTree.get("Status"));
  //     logger.log("Job tag : " + jsonResultTree.get("JobTag"));
  //     logger.log("Operation : " + jsonResultTree.get("API"));

  //     if (jsonResultTree.get("API").asText().equals("StartLabelDetection")) {

  //        if (jsonResultTree.get("Status").asText().equals("SUCCEEDED")){
  //           GetResultsLabels(jsonResultTree.get("JobId").asText(), context);
  //        }
  //        else{
  //           String errorMessage = "Video analysis failed for job "
  //                 + jsonResultTree.get("JobId")
  //                 + "State " + jsonResultTree.get("Status");
  //           throw new Exception(errorMessage);
  //        }

  //     } else
  //        logger.log("Operation not StartLabelDetection");

  //  } catch (Exception e) {
  //     logger.log("Error: " + e.getMessage());
  //     throw new RuntimeException (e);
  //  }
};
