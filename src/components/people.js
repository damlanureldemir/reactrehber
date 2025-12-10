import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import AddPersonModal from './AddPersonModal'; 
import UpdatePersonModal from './UpdatePersonModal'; 
import ProfileDropdown from "./ProfileDropdown"; // Profil dropdown bileşeni





const PeopleList = () => {
  const [countries, setCountries] = useState([]); // Ülke listesi için state
  const [people, setPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false); // Modal kontrolü
  const [showUpdateModal, setShowUpdateModal] = useState(false); // Güncelleme modalı
  const [selectedPerson, setSelectedPerson] = useState(null); 
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  

  useEffect(() => {
    setCurrentPage(1);
    fetchPeople();
    fetchCountries(); 
  }, [searchTerm]);

  const fetchCountries = async () => {
    try {
      const response = await axios.get("http://localhost:5200/api/people/countries", {
        withCredentials: true,
      });
      if (response.data.success) {
        setCountries(response.data.data);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("API çağrısı sırasında bir hata oluştu:", error);
      alert("Ülke verileri alınırken bir hata oluştu.");
    }
  };
  const fetchPeople = async () => {
    try {
      const response = await axios.get("http://localhost:5200/api/people/list", {
        withCredentials: true,
      });
      if (response.data.success) {
        setPeople(response.data.data);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("API çağrısı sırasında bir hata oluştu:", error);
      alert("Veriler alınırken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSuccess = () => {
    setShowAddModal(false); 
    fetchPeople(); 
  };
  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
    fetchPeople(); 
  };
  const handleEditClick = (person) => {
    setSelectedPerson(person); 
    setShowUpdateModal(true);
  };
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5200/api/user/logout", null, {
        withCredentials: true,
      });
      window.location.href = "/";
    } catch (error) {
      console.error("Çıkış sırasında hata:", error);
      alert("Çıkış yapılamadı.");
    }
  };
  
  const filteredPeople = people.filter((person) => {
    const fullName = `${person.name} ${person.surname}`.toLowerCase();
    return (
      fullName.includes(searchTerm) ||
      person.email.toLowerCase().includes(searchTerm) ||
      person.telephone.toLowerCase().includes(searchTerm)
    );
  });
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPeople.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPeople.length / itemsPerPage);
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  
  
  
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bu kişiyi silmek istediğinize emin misiniz?");
    if (!confirmDelete) return;
  
    try {
      const response = await axios.post(`http://localhost:5200/api/people/delete/${id}`, null, {
        withCredentials: true,
      });
  
      if (response.data.success) {
        alert("Kişi başarıyla silindi.");
        fetchPeople();
      } else {
        alert("Silme başarısız: " + response.data.message);
      }
    } catch (error) {
      console.error("Silme sırasında hata oluştu:", error);
      alert("Silme sırasında bir hata oluştu.");
    }
  };
  

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
    <button
      className="btn btn-primary"
      onClick={() => setShowAddModal(true)}
    >
      Kişi Ekle
    </button>

    <ProfileDropdown onLogout={handleLogout} />
  </div>
      <AddPersonModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
        userId={1} 
        countries={countries}

      />

<UpdatePersonModal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        person={selectedPerson} 
        onSuccess={handleUpdateSuccess}
        countries={countries}
      />

      <div className="card p-4">
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Arama yapın..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        />
        <div className="container mt-3">
          <h2 className="mb-4">Kişi Listesi</h2>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <table id="personTable" className="table table-bordered mt-3">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fotoğraf</th>
                  <th>Ad</th>
                  <th>Soyad</th>
                  <th>Telefon</th>
                  <th>Email</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
              {currentItems.map((person, index) => (
  <tr key={person.id}>
    <td>{indexOfFirstItem + index + 1}</td>
    <td>
      {person.imageBase64 ? (
        <img
          src={person.imageBase64}
          alt="Profile"
          style={{ width: 50, height: 50 }}
        />
      ) : (
        "Yok"
      )}
    </td>
    <td>{person.name}</td>
    <td>{person.surname}</td>
    <td>{person.telephone}</td>
    <td>{person.email}</td>
    <td>
      <button className="btn btn-info" onClick={() => handleEditClick(person)}>Düzenle</button>
      <button className="btn btn-danger ml-2" onClick={() => handleDelete(person.id)}>
        Sil
      </button>
    </td>
  </tr>
))}

              </tbody>
            </table>
          )}

<div className="d-flex justify-content-between mt-3">
  <button
    id="prevPage"
    className="btn btn-secondary"
    onClick={goToPrevPage}
    disabled={currentPage === 1}
  >
    Geri
  </button>
  <span id="pageInfo">
    Sayfa {currentPage} / {totalPages}
  </span>
  <button
    id="nextPage"
    className="btn btn-secondary"
    onClick={goToNextPage}
    disabled={currentPage === totalPages}
  >
    İleri
  </button>
</div>

        </div>
      </div>
    </div>
  );
};

export default PeopleList;
