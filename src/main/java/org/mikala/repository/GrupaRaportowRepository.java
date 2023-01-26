package org.mikala.repository;

import org.mikala.domain.GrupaRaportow;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the GrupaRaportow entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GrupaRaportowRepository extends JpaRepository<GrupaRaportow, Long> {}
