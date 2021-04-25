# Setting Environment Variables

If you want to store your configuration in a file (e.g. under source control), you can use a YAML file together with the --env-vars-file flag:

`gcloud functions deploy FUNCTION_NAME --env-vars-file env_variables.yaml`

# Deploying Cloud Function

In the function folder:

`gcloud functions deploy FUNCTION_NAME --source=./`

# Configuring CORS

`gsutil cors set JSON_FILE_NAME.json gs://BUCKET_NAME`

# Checking CORS

`gsutil cors get gs://BUCKET_NAME`
