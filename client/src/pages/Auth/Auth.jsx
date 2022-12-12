import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logIn, signUp } from "../../actions/AuthAction";
import "./auth.css";
import Logo from "../../img/logo.png";

const Auth = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.authReducer.loading);
  const [isSignUp, setIsSignUp] = useState(false);
  const [confirmPass, setConfirmPass] = useState(true);
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    confirmpass: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignUp) {
      data.password === data.confirmpass
        ? dispatch(signUp(data))
        : setConfirmPass(false);
    } else {
      dispatch(logIn(data));
    }
  };

  const resetForm = () => {
    setConfirmPass(true);
    setData({
      firstname: "",
      lastname: "",
      username: "",
      password: "",
      confirmpass: "",
    });
  };

  return (
    <div className="Auth">
      {/* Coté gauche */}
      <div className="a-left">
        <img src={Logo} alt="" />
        <div className="Webname">
          <h1>LOUIS Twitter</h1>
          <h6>Explore the ideas throughout the world</h6>
        </div>
      </div>

      {/* Coté Droit */}
      <div className="a-right">
        <form className="infoForm authForm" onSubmit={handleSubmit}>
          <h3>{isSignUp ? "S'inscrire" : "Se connecter"}</h3>

          {isSignUp && (
            <div>
              <input
                type="text"
                placeholder="Prénom"
                className="infoInput"
                name="firstname"
                onChange={handleChange}
                value={data.firstname}
              />
              <input
                type="text"
                placeholder="Nom"
                className="infoInput"
                name="lastname"
                onChange={handleChange}
                value={data.lastname}
              />
            </div>
          )}

          <div>
            <input
              type="text"
              className="infoInput"
              name="username"
              placeholder="Pseudo"
              onChange={handleChange}
              value={data.username}
            />
          </div>

          <div>
            <input
              type="password"
              className="infoInput"
              name="password"
              placeholder="Mot de passe"
              onChange={handleChange}
              value={data.password}
              style={{ border: confirmPass ? "none" : "1px solid red" }}
            />
            {isSignUp && (
              <input
                type="password"
                className="infoInput"
                name="confirmpass"
                placeholder="Confirm"
                onChange={handleChange}
                value={data.confirmpass}
                style={{ border: confirmPass ? "none" : "1px solid red" }}
              />
            )}
          </div>
          {isSignUp && (
            <span
              style={{
                display: confirmPass ? "none" : "block",
                color: "red",
                fontSize: "12px",
                alignSelf: "flex-end",
                marginRight: "5px",
              }}
            >
              * Vérifiez vos mot de passe
            </span>
          )}
          <div>
            <span
              className="accountState"
              style={{ fontSize: "12px", cursor: "pointer" }}
              onClick={() => {
                setIsSignUp((prev) => !prev);
                resetForm();
              }}
            >
              {isSignUp
                ? "Vous avez déja un compte ? Connectez-Vous !"
                : "Vous n'avez pas de compte ? Inscrivez-vous !"}
            </span>
          </div>
          <button className="button infoButton" type="submit" disabled={loading}>
            {loading ? "Chargement" : isSignUp ? "S'inscrire" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Auth;
