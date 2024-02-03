package com.project.test.controllers;

import com.project.test.entities.CompanyEntity;
import com.project.test.entities.SupplyEntity;
import com.project.test.services.CompanyService;
import com.project.test.services.SupplyService;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/companies")
public class CompanyController {
  private final CompanyService companyService;
  private final SupplyService supplyService;

  public CompanyController(CompanyService companyService, SupplyService supplyService) {
    this.companyService = companyService;
    this.supplyService = supplyService;
  }

  @GetMapping
  public ResponseEntity<List<CompanyEntity>> getAllCompanies() {
    List<CompanyEntity> companies = companyService.getAllCompanies();
    return ResponseEntity.ok(companies);
  }

  @GetMapping("/{id}")
  public ResponseEntity<CompanyEntity> getCompanyById(@PathVariable("id") Long id) {
    CompanyEntity company = companyService.getCompanyById(id);
    return ResponseEntity.ok(company);
  }

  @PostMapping
  public ResponseEntity<CompanyEntity> createCompany(@RequestBody CompanyEntity company) {

    String postalCode = company.getPostalCode();
    postalCode = postalCode.replaceAll("\\D", "");

    try {
      HttpClient client = HttpClient.newHttpClient();
      HttpRequest request =
          HttpRequest.newBuilder()
              .uri(URI.create("http://cep.la/" + postalCode))
              .header("Accept", "application/json")
              .build();

      HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

      if (response.statusCode() == 200) {
        String responseBody = response.body();

        System.out.println(responseBody.isEmpty());
        if (responseBody != null && !responseBody.equals("[]")) {

          CompanyEntity createdCompany = companyService.createCompany(company);
          return ResponseEntity.ok(createdCompany);
        } else {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
      } else if (response.statusCode() >= 400 && response.statusCode() < 500) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
      } else {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
    } catch (IOException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PutMapping("/{id}")
  public ResponseEntity<CompanyEntity> updateCompany(
      @PathVariable("id") Long id, @RequestBody CompanyEntity updatedCompany) {
    CompanyEntity company = companyService.updateCompany(id, updatedCompany);
    return ResponseEntity.ok(company);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteCompany(@PathVariable("id") Long id) {
    companyService.deleteCompany(id);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/{companyId}/supplies/{supplyId}")
  public ResponseEntity<Void> addSupplyToCompany(
      @PathVariable("companyId") Long companyId, @PathVariable("supplyId") Long supplyId) {
    CompanyEntity company = companyService.getCompanyById(companyId);
    SupplyEntity supply = supplyService.getSupplyById(supplyId);

    company.getSupplies().add(supply);
    companyService.updateCompany(companyId, company);

    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/{companyId}/supplies/{supplyId}")
  public ResponseEntity<Void> removeSupplyFromCompany(
      @PathVariable("companyId") Long companyId, @PathVariable("supplyId") Long supplyId) {
    CompanyEntity company = companyService.getCompanyById(companyId);
    SupplyEntity supply = supplyService.getSupplyById(supplyId);

    company.getSupplies().remove(supply);
    companyService.updateCompany(companyId, company);

    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{companyId}/supplies")
  public ResponseEntity<List<SupplyEntity>> getSuppliesByCompanyId(@PathVariable Long companyId) {
    CompanyEntity company = companyService.getCompanyById(companyId);
    List<SupplyEntity> supplies = company.getSupplies();
    return ResponseEntity.ok(supplies);
  }
}
