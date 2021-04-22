# Setting Environment Variables

If you want to store your configuration in a file (e.g. under source control), you can use a YAML file together with the --env-vars-file flag:

`gcloud functions deploy process-video --env-vars-file env_variables.yaml`

# Deploying Cloud Function

`gcloud functions deploy process-video --source=./`
