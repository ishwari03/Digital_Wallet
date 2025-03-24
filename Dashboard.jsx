import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Welcome to your wallet!</p>
      <Link to="/">Logout</Link>
    </div>
  );
}

export default Dashboard;
