package com.project.test.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import java.util.List;

@Entity
@Table(name = "supplies")
public class SupplyEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String supplier_code;

  private String email;

  private String name;

  private String postal_code;

  @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
  @ManyToMany(mappedBy = "supplies")
  private List<CompanyEntity> companies;

  // Constructors, getters, and setters
  public SupplyEntity() {}

  public SupplyEntity(String supplier_code, String email, String name, String postal_code) {
    this.supplier_code = supplier_code;
    this.email = email;
    this.name = name;
    this.postal_code = postal_code;
  }

  @Override
  public String toString() {
    return "SupplyEntity{"
        + "id="
        + id
        + ", supplierCode="
        + supplier_code
        + ", email='"
        + email
        + '\''
        + ", name='"
        + name
        + '\''
        + ", postalCode='"
        + postal_code
        + '\''
        + ", companies="
        + companies
        + '}';
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getSupplierCode() {
    return supplier_code;
  }

  public void setSupplierCode(String supplier_code) {
    this.supplier_code = supplier_code;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getPostalCode() {
    return postal_code;
  }

  public void setPostalCode(String postal_code) {
    this.postal_code = postal_code;
  }

  public List<CompanyEntity> getCompanies() {
    return companies;
  }

  public void setCompanies(List<CompanyEntity> companies) {
    this.companies = companies;
  }

  // public void addCompany(CompanyEntity company) {
  //   if (companies == null) {
  //     companies = new ArrayList<>();
  //   }
  //   companies.add(company);
  // company.getSupplies().add(this); // Bidirectional association
  // }
}
