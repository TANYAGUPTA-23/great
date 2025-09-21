import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import ShopContextProvider from './context/ShopContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render( /* Creates a “root” where your React component tree will live.It’s part of Concurrent Mode features, which allows React to optimize rendering and make the UI more responsive. */
  <BrowserRouter> {/* Wraps your app to enable routing (navigation without full page reloads).Without it, you can’t use <Route>, <Link>, useNavigate(), etc.*/}
    <ShopContextProvider> {/*This is your custom Context Provider.It makes ShopContext values (like navigate, token, setCartItems, backendUrl) available to all components inside it without prop drilling. */}
      <App /> {/* The root component of your application.*/}
    </ShopContextProvider>
  </BrowserRouter>
);
