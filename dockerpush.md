npx nx build api
docker build -t iverify-api:latest -f ./apps/api/Dockerfile .
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 427524370246.dkr.ecr.us-east-1.amazonaws.com
docker tag iverify-api:latest 427524370246.dkr.ecr.us-east-1.amazonaws.com/iverify-api:latest
docker push 427524370246.dkr.ecr.us-east-1.amazonaws.com/iverify-api:latest


docker build -t iverify-publisher:latest -f ./apps/publisher/Dockerfile .
docker tag iverify-publisher:latest 427524370246.dkr.ecr.us-east-1.amazonaws.com/iverify-publisher:latest
docker push 427524370246.dkr.ecr.us-east-1.amazonaws.com/iverify-publisher:latest


docker build -t iverify-triage:latest -f ./apps/triage/Dockerfile .
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 427524370246.dkr.ecr.us-east-1.amazonaws.com
docker tag iverify-triage:latest 427524370246.dkr.ecr.us-east-1.amazonaws.com/iverify-triage:latest
docker push 427524370246.dkr.ecr.us-east-1.amazonaws.com/iverify-triage:latest