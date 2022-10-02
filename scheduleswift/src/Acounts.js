import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import EditInfo from "./Components/editInfo.component";
import ViewInfo from "./Components/viewInfo.component";
function Accounts() {
    return (
        <Router>
            <div className="Accounts">

                <div className="auth-wrapper">
                    <div className="auth-inner">
                        <Routes>
                            <Route exact path="/" element={<ViewInfo />} />
                            <Route path="/viewInfo" element={<ViewInfo />} />
                            <Route path="/editInfo" element={<EditInfo />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    )
}

export default Accounts;