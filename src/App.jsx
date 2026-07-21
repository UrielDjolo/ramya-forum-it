import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Contact from "./pages/Contact";

const Admin = lazy(() => import("./pages/Admin"));

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/contact"
        element={
          <Layout>
            <Contact />
          </Layout>
        }
      />
      <Route
        path="/ramya-admin"
        element={
          <Suspense fallback={<div className="min-h-screen bg-surface" />}>
            <Admin />
          </Suspense>
        }
      />
    </Routes>
  );
}

export default App;
