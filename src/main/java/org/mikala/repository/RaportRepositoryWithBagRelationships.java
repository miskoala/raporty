package org.mikala.repository;

import java.util.List;
import java.util.Optional;
import org.mikala.domain.Raport;
import org.springframework.data.domain.Page;

public interface RaportRepositoryWithBagRelationships {
    Optional<Raport> fetchBagRelationships(Optional<Raport> raport);

    List<Raport> fetchBagRelationships(List<Raport> raports);

    Page<Raport> fetchBagRelationships(Page<Raport> raports);
}
