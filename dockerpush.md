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


mysql -hiverify-sl.cq3yvsqxpn0x.us-east-1.rds.amazonaws.com -uadmin -piverifyxya123 --port 3306

INSERT INTO `user`(firstName,lastName,email,phone,address,password,createdBy) VALUES ('test', 'test','palinda@xeptagon.com','+94772381823','test','$2a$10$xsnOLNkxYBPQvXKstv7TO9uxKR4jLhGWb7OXdZShlTs0sXWW0Bv.','Manual');


mysql -hiverify-bd.cq3yvsqxpn0x.us-east-1.rds.amazonaws.com -uadmin -piveri\!e34fyxya123bd --port 3306

use iverifysl;
show tables;