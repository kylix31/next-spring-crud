package com.project.test.repositories;

import com.project.test.entities.SupplyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplyRepository extends JpaRepository<SupplyEntity, Long> {}
