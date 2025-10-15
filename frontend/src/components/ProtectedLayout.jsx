import Navbar from "./Navbar";
import Footer from "./Footer";

const ProtectedLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      <Navbar />
      <main className="flex-grow p-6">{children}</main>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;
