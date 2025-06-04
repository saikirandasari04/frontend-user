   import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
   import ProtectedRoute from './ProtectedRoute';
   import Home from './pages/Home';
   import Auth from './pages/Auth';

   function App() {
     return (
       <Router>
         <Routes>
           <Route path="/auth" element={<Auth />} />
           <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
        />
         </Routes>
       </Router>
     );
   }

   export default App;