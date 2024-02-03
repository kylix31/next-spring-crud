package com.project.test.services;

import com.project.test.entities.CompanyEntity;
import com.project.test.repositories.CompanyRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class CompanyService {
  private final CompanyRepository companyRepository;

  public CompanyService(CompanyRepository companyRepository) {
    this.companyRepository = companyRepository;
  }

  public List<CompanyEntity> getAllCompanies() {
    return companyRepository.findAll();
  }

  public CompanyEntity getCompanyById(Long id) {
    return companyRepository
        .findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Company not found with id: " + id));
  }

  public CompanyEntity createCompany(CompanyEntity company) {
    return companyRepository.save(company);
  }

  public CompanyEntity updateCompany(Long id, CompanyEntity updatedCompany) {
    CompanyEntity company = getCompanyById(id);
    company.setCompanyCode(updatedCompany.getCompanyCode());
    company.setPhantasyName(updatedCompany.getPhantasyName());
    company.setPostalCode(updatedCompany.getPostalCode());
    return companyRepository.save(company);
  }

  public void deleteCompany(Long id) {
    CompanyEntity company = getCompanyById(id);
    companyRepository.delete(company);
  }
}
