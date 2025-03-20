import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

// Mock user database
interface User {
  username: string;
  password: string;
  accountId: string;
}

const users: Record<string, User> = {
  alice: { username: "alice", password: "password123", accountId: "acc1" },
  bob: { username: "bob", password: "securePass", accountId: "acc2" }
};

// Mock account database
interface Account {
  id: string;
  balance: number;
}

const accounts: Record<string, Account> = {
  acc1: { id: "acc1", balance: 1000 },
  acc2: { id: "acc2", balance: 500 }
};

/**
 * Simulates authentication (DO NOT store plaintext passwords in real applications).
 */
const authenticateUser = (username: string, password: string): string | null => {
  const user = users[username];
  return user && user.password === password ? user.accountId : null;
};

const updateBalance = async (id: string, amount: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!accounts[id]) reject(new Error("Account not found"));

      const newBalance = accounts[id].balance + amount;
      if (newBalance < 0) reject(new Error("Insufficient funds"));

      accounts[id].balance = newBalance;
      resolve(newBalance);
    }, 100);
  });
};

// 🚨 IMPLEMENT THE FOLLOWING ENDPOINTS 🚨
// 1️⃣ Implement authentication: Allow users to log in with username and password
//    and return their associated account ID securely.
app.<...>("<...>", (req: Request, res: Response) => {
  const { username, password } = <...>
  
  // TODO:   Implement authentication logic here
  //          Add comment to how you would make this more secure if you had the time.
  
  // Remove error if successfully implemented
  res.status(501).json({ error: "Not implemented" });
});

// 2️⃣ Implement: Retrieve the balance for a given account.
app.<...>("<...>", (req: Request, res: Response) => {
  const { id } = req.params;
  
  // TODO: Implement balance retrieval logic here
  
 // Remove error if successfully implemented
  res.status(501).json({ error: "Not implemented" });
});

// 3️⃣ Implement: Allow deposits, ensuring proper error handling.
app.<...>("<...>", async (req: Request, res: Response) => {
  const { id } = <...>;
  const { amount } = <...>;
  
  // TODO: Implement deposit logic here

   // Remove error if successfully implemented
  res.status(501).json({ error: "Not implemented" });
});

// 4️⃣ Implement: Allow withdrawals with overdraft prevention.
app.<...>("<...>", async (req: Request, res: Response) => {
  const { id } = <...>;
  const { amount } = <...>;
  // TODO: Implement withdraw logic here

 // Remove error if successfully implemented
  res.status(501).json({ error: "Not implemented" });
});

app.listen(3000, () => console.log("Server running on port 3000"));

app.listen(3000, () => console.log("Server running on port 3000"));
