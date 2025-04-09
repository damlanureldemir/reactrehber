import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const AddPersonModal = ({ show, onHide, userId, countries, onSuccess }) => {
    const [formData, setFormData] = useState({
        Name: "",
        Surname: "",
        CountryId: "",
        Telephone: "",
        HomePhone: "",
        WorkPhone: "",
        Email: "",
        Address: "",
        ProfileImage2: null
    });

    const resetForm = () => {
        setFormData({
            Name: "",
            Surname: "",
            CountryId: "",
            Telephone: "",
            HomePhone: "",
            WorkPhone: "",
            Email: "",
            Address: "",
            ProfileImage2: null
        });
        setSelectedCountryCode("");
    };
    
    const handleKeyPress = (e) => {
        if (!/[\d]/.test(e.key)) { 
          e.preventDefault();
        }
      };
      
    const [selectedCountryCode, setSelectedCountryCode] = useState("");
    const [displayedTelephone, setDisplayedTelephone] = useState("");

    useEffect(() => {
        const selectedCountry = countries.find(
            (c) => c.id === parseInt(formData.CountryId)
        );
        if (selectedCountry) {
            setSelectedCountryCode("+" + (selectedCountry.phoneCode || ""));
        }
    }, [formData.CountryId, countries]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === "Telephone") {
            let valueWithoutCode = value;
        
            if (value.startsWith(selectedCountryCode)) {
                valueWithoutCode = value.slice(selectedCountryCode.length);
            }
        
            const rawNumber = valueWithoutCode.replace(/[^\d]/g, "");
        
            setFormData((prev) => ({ ...prev, Telephone: rawNumber }));
            setDisplayedTelephone(rawNumber);
        
            return;
        }
        

        if (id === "CountryId") {
            const selectedCountry = countries.find((c) => c?.Id === parseInt(value));

            if (selectedCountry) {
                setSelectedCountryCode("+" + selectedCountry.PhoneCode);
            } else {
                setSelectedCountryCode("");
            }
        }

        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, ProfileImage2: e.target.files[0] }));
    };
    
    const handleSubmit = async () => {
        const data = new FormData();
    
        const fullPhoneNumber = `${selectedCountryCode}${formData.Telephone}`;
        Object.entries(formData).forEach(([key, value]) => {
            if (key !== "Telephone" && key !== "TelephoneCode" && value) {
                data.append(key, value);
            }
        });
    
        data.append("Telephone", fullPhoneNumber);
        data.append("TelephoneCode", selectedCountryCode);
    
        const userId = localStorage.getItem("userId");
        data.append("UserId", userId);
    
        try {
            const response = await axios.post("http://localhost:5200/api/people/add", data);
            if (response.data.success) {
                MySwal.fire({
                    icon: "success",
                    title: "Başarılı!",
                    text: response.data.message || "Kişi başarıyla eklendi.",
                    confirmButtonColor: "#28a745"
                });
                resetForm();
                onSuccess();
                onHide();
            } else {
                MySwal.fire({
                    icon: "error",
                    title: "Hata!",
                    text: response.data.message || "İşlem başarısız.",
                    confirmButtonColor: "#dc3545"
                });
            }
        } catch (error) {
            MySwal.fire({
                icon: "error",
                title: "Hata!",
                text: "Bir hata oluştu.",
                confirmButtonColor: "#dc3545"
            });
        }
    };
    
    

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Kişi Ekle</Modal.Title>
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
        style={{ maxWidth: "100px", marginRight: "10px", color: "black" }}
        readOnly
        value={selectedCountryCode}
    />
    <Form.Control
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
                    />
                    <Form.Control
                        className="mb-2"
                        id="WorkPhone"
                        placeholder="İş Telefonu"
                        value={formData.WorkPhone}
                        onChange={handleChange}
                    />
                    <Form.Control
                        className="mb-2"
                        id="Email"
                        type="email"
                        placeholder="Email"
                        value={formData.Email}
                        onChange={handleChange}
                    />
                    <Form.Control
                        className="mb-2"
                        id="ProfileImage2"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <Form.Control
                        className="mb-2"
                        as="textarea"
                        rows={3}
                        id="Address"
                        placeholder="Adres"
                        value={formData.Address}
                        onChange={handleChange}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    İptal
                </Button>
                <Button variant="success" onClick={handleSubmit}>
                    Kaydet
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddPersonModal;
