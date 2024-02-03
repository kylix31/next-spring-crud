package com.project.test.services;

import com.project.test.entities.CompanyEntity;
import com.project.test.entities.SupplyEntity;
import com.project.test.repositories.CompanyRepository;
import com.project.test.repositories.SupplyRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class SupplyService {
  private final SupplyRepository supplyRepository;
  private final CompanyRepository companyRepository;

  public SupplyService(SupplyRepository supplyRepository, CompanyRepository companyRepository) {
    this.supplyRepository = supplyRepository;
    this.companyRepository = companyRepository;
  }

  public List<SupplyEntity> getAllSupplies() {
    return supplyRepository.findAll();
  }

  public SupplyEntity getSupplyById(Long id) {
    return supplyRepository
        .findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Supply not found with id: " + id));
  }

  public CompanyEntity getCompanyById(Long id) {
    return companyRepository
        .findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Supply not found with id: " + id));
  }

  public SupplyEntity createSupply(SupplyEntity supply) {
    return supplyRepository.save(supply);
  }

  public SupplyEntity updateSupply(Long id, SupplyEntity updatedSupply) {
    SupplyEntity supply = getSupplyById(id);

    supply.setSupplierCode(updatedSupply.getSupplierCode());
    supply.setEmail(updatedSupply.getEmail());
    supply.setName(updatedSupply.getName());
    supply.setPostalCode(updatedSupply.getPostalCode());

    return supplyRepository.save(supply);
  }

  public void deleteSupply(Long id) {
    SupplyEntity supply = getSupplyById(id);
    supplyRepository.delete(supply);
  }
}
