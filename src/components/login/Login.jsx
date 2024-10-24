import { useState } from 'react'
import "./Login.css";
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const auth = useAuth();
    const navigate = useNavigate();

    const handleLogin = (event) => {
        event.preventDefault();
        const success = auth.login({ userName, password });
        if (!success) {
            setError("Invalid credentials");
        }
        navigate("/"); // Navigate to the home page
    };


    return (
        <div
            className="login_page_wrapper"
            style={{ backgroundImage: "url(/img/bg.jpg" }}
        >
            <div id="login_card">
                <div className="md-card-content large-padding" id="login_form">
                    <div className="login_heading">
                        <img src="/img/logo_img.png" alt="Logo" />
                    </div>
                    <form onSubmit={handleLogin} acceptCharset="utf-8">
                        <div className="uk-form-row"></div>
                        <table>
                            <tbody>
                                <tr>
                                    <td className="form-icon">S</td>
                                    <td>
                                        <input
                                            className="md-input"
                                            required
                                            type="tel"
                                            id="login_username"
                                            placeholder="Enter Code"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                            style={{ background: "#fff" }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="form-icon">
                                        <i className="fa fa-lock" aria-hidden="true"></i>
                                    </td>
                                    <td>
                                        <input
                                            className="md-input"
                                            required
                                            type="password"
                                            placeholder="Password"
                                            id="login_password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            style={{ background: "#fff" }}
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td></td>
                                    <td>
                                        <input
                                            type="submit"
                                            value="Login"
                                            className="md-btn md-btn-primary md-btn-block md-btn-large"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login