
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// ...existing code...

function App() {
  return (
    <Router>
      <Switch>
        {/* ...existing routes... */}
        <Route path="/" exact component={HomePage} />
        <Route path="/about" component={AboutPage} />
        {/* Add more routes as needed */}
        <Route component={NotFoundPage} /> {/* Fallback route */}
      </Switch>
    </Router>
  );
}

// Define the NotFoundPage component
function NotFoundPage() {
  return <h1>404 - Page Not Found</h1>;
}

export default App;