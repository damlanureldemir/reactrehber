import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const UpdatePersonModal = ({ show, onHide, person, countries, onSuccess }) => {
  const [formData, setFormData] = useState({
    Name: "",
    Surname: "",
    CountryId: "",
    Telephone: "",
    TelephoneCode: "",
    HomePhone: "",
    WorkPhone: "",
    Email: "",
    Address: "",
    ProfileImage2: null,
  });

  const [selectedCountryCode, setSelectedCountryCode] = useState(""); // Telefon kodu
  const [displayedTelephone, setDisplayedTelephone] = useState("");

  useEffect(() => {
    if (person) {
      const selectedCountry = countries.find(
        (c) => c.id === parseInt(person.countryId)
      );
      const phoneCode = selectedCountry ? "+" + (selectedCountry.phoneCode || "") : "";

      setSelectedCountryCode(phoneCode);

      const rawTelephone = person.telephone?.replace(phoneCode, "") || "";

      
      setFormData({
        Name: person.name || "",
        Surname: person.surname || "",
        CountryId: person.countryId || "",
        Telephone: rawTelephone,
        TelephoneCode: phoneCode,
        HomePhone: person.homePhone || "",
        WorkPhone: person.workPhone || "",
        Email: person.email || "",
        Address: person.address || "",
        ProfileImage2: person.imageBase64 || null,
      });

      setDisplayedTelephone(phoneCode + rawTelephone);
    }
  }, [person, countries]);

  const handleChange = (e) => {
    const { id, value } = e.target;
  

    if (id === "Telephone" || id === "HomePhone" || id === "WorkPhone") {
      let valueWithoutCode = value;
  
      
      if (value.startsWith(selectedCountryCode)) {
        valueWithoutCode = value.slice(selectedCountryCode.length);
      }
  
    
      const rawNumber = valueWithoutCode.replace(/[^\d]/g, "");
  
      setFormData((prev) => ({ ...prev, [id]: rawNumber }));

      if (id === "Telephone") {
        setDisplayedTelephone(selectedCountryCode + rawNumber);
      }
  
      return;
    }
  

    if (id === "CountryId") {
      const selectedCountry = countries.find((c) => c.id === parseInt(value));
      const newPhoneCode = selectedCountry ? "+" + selectedCountry.phoneCode : "";

      const currentRaw = displayedTelephone.startsWith(selectedCountryCode)
        ? displayedTelephone.slice(selectedCountryCode.length)
        : formData.Telephone;
  
      setSelectedCountryCode(newPhoneCode);
      setDisplayedTelephone(newPhoneCode + currentRaw);
      setFormData((prev) => ({
        ...prev,
        Telephone: currentRaw,
        CountryId: value,
        TelephoneCode: newPhoneCode,
      }));
  
      return;
    }

    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  
  

  const handleKeyPress = (e) => {
    if (!/[\d]/.test(e.key)) { 
      e.preventDefault();
    }
  };
  
  
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, ProfileImage2: e.target.files[0] }));
  };

  const handleSubmit = async () => {
    const data = new FormData();
  
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "Telephone" && value) {
        data.append(key, value);
      }
    });
  
    const fullTelephone = selectedCountryCode + formData.Telephone;
    data.append("Telephone", fullTelephone);
    data.append("TelephoneCode", selectedCountryCode); // 🆕 Telefon kodunu da gönder
    const userId = localStorage.getItem("userId");
    data.append("UserId", userId);
  
    try {
      const response = await axios.post(
        `http://localhost:5200/api/people/update/${person.id}`,
        data
      );
  
      if (response.data.success) {
        MySwal.fire({
          title: <strong>Kişi Güncellendi</strong>,
          icon: "success",
          text: response.data.message,
        });
        onSuccess();
        onHide();
      } else {
        MySwal.fire({
          title: <strong>Güncelleme Başarısız</strong>,
          icon: "error",
          text: response.data.message,
        });
      

      }
    } catch (error) {
      MySwal.fire({
        title: <strong>Güncelleme Hatası</strong>,
        icon: "error",
        text: "Bir hata oluştu.",
      });
    }
  };
  

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Kişi Güncelle</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            className="mb-2"
            id="Name"
            placeholder="Ad"
            value={formData.Name}
            onChange={handleChange}
          />
          <Form.Control
            className="mb-2"
            id="Surname"
            placeholder="Soyad"
            value={formData.Surname}
            onChange={handleChange}
          />
          <Form.Select
            className="mb-2"
            id="CountryId"
            value={formData.CountryId}
            onChange={handleChange}
          >
            <option value="">Ülke Seçiniz</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Form.Select>
          <div className="mb-2 d-flex">
            <Form.Control
              className="mb-2"
              id="Telephone"
              placeholder="Telefon"
              value={displayedTelephone}
              onChange={handleChange}
              onKeyPress={handleKeyPress} 
            />
          
          </div>
          <Form.Control
            className="mb-2"
            id="HomePhone"
            placeholder="Ev Telefonu"
            value={formData.HomePhone}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
          <Form.Control
            className="mb-2"
            id="WorkPhone"
            placeholder="İş Telefonu"
            value={formData.WorkPhone}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
          <Form.Control
            className="mb-2"
            id="Email"
            placeholder="Email"
            value={formData.Email}
            onChange={handleChange}
          />
          <Form.Control
            className="mb-2"
            id="Address"
            placeholder="Adres"
            value={formData.Address}
            onChange={handleChange}
          />
          <div className="mb-2">
            <Form.Label>Fotoğraf Yükle</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Kapat
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Güncelle
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdatePersonModal;
