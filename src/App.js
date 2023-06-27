import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle';
import Navbar from "./components/navbar";
import Home from "./pages/home";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Lobby from "./pages/game/lobby";
import LoginPage from "./pages/login";
import RegisPage from "./pages/signup";
import Customer from "./pages/customer"
import Supplier from "./pages/supplier"
import InCustomer from "./pages/inSide/Icustomer"
import InSupplier from "./pages/inSide/Isupplier"
import CreateQuote from "./pages/inSide/IPO/create/create"
import InsideQuote from "./pages/inSide/IPO/create/inProject"
import StaticQuote from "./pages/inSide/IPO/create/createStatic"
import StaticQuote2 from "./pages/inSide/IPO/create/createStaticClick"


function App() {


    const script = document.createElement("script");
    script.src = "src\split.js";
    script.async = true;
    document.body.appendChild(script);


    return (<>
        <BrowserRouter>
            <div className="container" >
            <Navbar/>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/home" element={<Home/>}/>
                <Route
                    path="/login"
                    element={<LoginPage
                    />}
                />
                <Route
                    path="/regis"
                    element={<RegisPage
                    />}
                />
                <Route path="/lobby" element={<Lobby/>}/>
                <Route path="/customer" element={<Customer/>}/>
                <Route path="/supplier" element={<Supplier/>}/>
                <Route path="/inc" element={<InCustomer/>}/>
                <Route path="/ins" element={<InSupplier/>}/>
                <Route path="/createQuotation" element={<CreateQuote/>}/>
                <Route path="/insideQuotation" element={<InsideQuote/>}/>
                <Route path="/staticQuotation" element={<StaticQuote/>}/>
                <Route path="/staticQuotation2" element={<StaticQuote2/>}/>
            </Routes>
        </div>
        </BrowserRouter>
    </>);
}

export default App;
