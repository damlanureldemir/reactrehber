import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Şifreler eşleşmiyor!");
      return;
    }

    axios
      .post("http://localhost:5200/api/user/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setSuccessMessage(response.data.message);
        setFormData({
          name: "",
          surname: "",
          email: "",
          telephone: "",
          password: "",
          confirmPassword: "",
        });

        // İsteğe bağlı yönlendirme:
        setTimeout(() => {
           window.location.href = "/";
        }, 2000);
      })
      .catch((error) => {
        if (error.response) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
        }
      });
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(135deg, #2c3e50, #4ca1af)" }}
    >
      <div
        className="register-container p-4 bg-white rounded shadow"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center text-primary">Hesap Oluştur</h2>

        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Ad</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Soyad</label>
            <input
              type="text"
              className="form-control"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">E-posta</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Telefon</label>
            <input
              type="tel"
              className="form-control"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Şifre</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Şifre Tekrar</label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Kayıt Ol
          </button>
        </form>

        <div className="text-center mt-3">
          <a href="/login" className="text-primary">
            Zaten hesabınız var mı? Giriş yapın.
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
