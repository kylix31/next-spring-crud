package com.project.test.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import java.util.List;

@Entity
@Table(name = "companies")
public class CompanyEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String company_code;

  private String phantasy_name;

  private String postal_code;

  @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
  @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
  @JoinTable(
      name = "company_supplies",
      joinColumns = @JoinColumn(name = "company_id"),
      inverseJoinColumns = @JoinColumn(name = "supply_id"))
  private List<SupplyEntity> supplies;

  // Constructors, getters, and setters
  public CompanyEntity() {}

  public CompanyEntity(String company_code, String phantasy_name, String postal_code) {
    this.company_code = company_code;
    this.phantasy_name = phantasy_name;
    this.postal_code = postal_code;
  }

  @Override
  public String toString() {
    return "CompanyEntity{"
        + "id="
        + id
        + ", companyCode="
        + company_code
        + ", phantasyName='"
        + phantasy_name
        + '\''
        + ", postalCode='"
        + postal_code
        + '\''
        + ", supplies="
        + supplies
        + '}';
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getCompanyCode() {
    return company_code;
  }

  public void setCompanyCode(String company_code) {
    this.company_code = company_code;
  }

  public String getPhantasyName() {
    return phantasy_name;
  }

  public void setPhantasyName(String phantasy_name) {
    this.phantasy_name = phantasy_name;
  }

  public String getPostalCode() {
    return postal_code;
  }

  public void setPostalCode(String postal_code) {
    this.postal_code = postal_code;
  }

  public List<SupplyEntity> getSupplies() {
    return supplies;
  }

  public void setSupplies(List<SupplyEntity> supplies) {
    this.supplies = supplies;
  }

  // public void addSupply(SupplyEntity supply) {
  //   if (supplies == null) {
  //     supplies = new ArrayList<>();
  //   }
  //   supplies.add(supply);
  //   // supply.getCompanies().add(this);
  // }
}
