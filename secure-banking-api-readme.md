1️⃣ Setting Up the Project
Go to CodeSandbox: https://codesandbox.io/
Create a New Sandbox:
Choose "Node.js" template.

Install Express & TypeScript by running:

npm install express
npm install --save-dev @types/express

Run the Server:
Ensure the app is listening on port 3000.
The CodeSandbox preview should display "Server running on port 3000".

Note: res.status(501).json({ error: "Not implemented" }); 
      is a valid response if you do not get time to implement.

      Skeleton code is provided.  
     <...> is a placeholder for code the needs to be added.

2️⃣ Testing the Endpoints
Once the server is running, the candidate can use cURL or Postman to test the API.

Authenticate & Get Account ID
Request:

curl -X <...> http://localhost:3000/<...> -H "Content-Type: application/json" -d '{"username": "alice", "password": "password123"}'

🔹 Retrieve Account Balance
Request:

curl -X <...>  http://localhost:3000<...> 

🔹 Deposit Money

Request:
curl -X <...>  http://localhost:3000/<...> -H "Content-Type: application/json" -d '{"amount": 200}'

Expected Response:
{ "accountId": "acc1" }

🔹 Withdraw Money

Request:
curl -X <...>  http://localhost:3000/<...> -H "Content-Type: application/json" -d '{"amount": 500}'

Expected Response:
{ "accountId": "acc1", "balance": 500 }

If withdrawing more than the balance:
{ "error": "Insufficient funds" }

3️⃣ Handling Edge Cases
Incorrect credentials → Should return HTTP 401.
Negative deposit/withdrawal amount → Should return HTTP 400.
Accessing a non-existent account → Should return HTTP 404.

4️⃣ Alternative Testing: Postman
For those unfamiliar with cURL, Postman can be used:

Open Postman.
Create a <...>  request to http://localhost:3000/login.
Set Headers:
"Content-Type": "application/json"
