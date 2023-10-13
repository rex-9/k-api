# k-api-dev
 K Development API\
 For internal use only, please do not distribute this code.


1. Make sure you install serverless framework first by executing this command:\
**npm install -g serverless**
2. After that you need to configure the serverless, can execute this command:\
**serverless config credentials --provider aws --key 1234 --secret 5678 --profile serverlessAdmin**
3. Run **npm install** to install all the pre-requisites
4. Run **prisma generate** to generate prisma client
5. Run **prisma db seed** to seed dummy data in database
6. Run **serverless offline** to run the local server, it should be on port: 3001
