import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    telephone: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:5200/api/user/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      // Başarılı giriş
      alert(response.data.message);

    
      window.location.href = "/people";
      localStorage.setItem("userId", response.data.user.id);

      console.log(response.data.user.id);

    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Bir hata oluştu.");
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(135deg, #2c3e50, #4ca1af)" }}
    >
      <div
        className="login-container p-4 bg-white rounded shadow"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center text-primary">Rehber Uygulamasına Giriş</h2>

        {errorMessage && (
          <div className="alert alert-danger text-center">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="telephone" className="form-label">
              Telefon Numarası
            </label>
            <input
              type="text"
              className="form-control"
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Şifre
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-text-primary w-100" style={{ backgroundColor: "#007bff", color: "#fff" }}>
            Giriş Yap
          </button>
        </form>

        <div className="text-center mt-3">
          <a href="/register" className="text-primary">
            Hesabınız yok mu? Kayıt olun.
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
