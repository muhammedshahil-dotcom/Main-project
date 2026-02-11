import AppRoutes from "./routes/AppRouter";
import GlobalLoader from "./components/GlobalLoader";

function App(){
  return (
    <>
      <GlobalLoader />
      <AppRoutes />
    </>
  );
}


export default App;
