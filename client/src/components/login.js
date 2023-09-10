import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import Axios from 'axios'

const Login = () => {

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  const loginInfo = {
    email_address: email,
    password: pass,
  };

  const handleSubmit = () => {
    Axios.post("/api/LoginUser", loginInfo)
      .then((response) => {
        if (response.data.message === "Login successful") {
          navigate("/welcome");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    Axios.get("/api/LoggedIn")
      .then((response) => {
        if (response.data.Message === "Authorized") {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (isAuthorized) {
    navigate("/welcome");
    return null;
  }

  return (
    <>
      <p>Login</p>
      <div className="form-div">
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <input value={pass} onChange={(e) => setPass(e.target.value)} />
        <button onClick={handleSubmit}>Login</button>
      </div>
      <Link to="/reg">Signup</Link>
    </>
  );
}

export default Login
