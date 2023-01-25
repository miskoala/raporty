package org.mikala.repository;

import org.mikala.domain.Raport;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Raport entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RaportRepository extends JpaRepository<Raport, Long> {}
